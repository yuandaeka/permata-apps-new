const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

if (!process.env.VERCEL) {
  process.exit(0);
}

const apiDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(apiDir, '../..');
const repoRootNodeModules = path.join(repoRoot, 'node_modules');
const apiNodeModules = path.join(apiDir, 'node_modules');
const pnpmVirtualNodeModules = path.join(repoRootNodeModules, '.pnpm/node_modules');

let needsRelink = false;
try {
  const stat = fs.lstatSync(path.join(apiNodeModules, 'express'));
  if (!stat.isSymbolicLink() || !fs.existsSync(path.join(apiNodeModules, '.bin/prisma'))) {
    needsRelink = true;
  }
} catch {
  needsRelink = true;
}

if (needsRelink) {
  console.log('Restoring pnpm workspace symlinks from cached virtual store...');
  fs.rmSync(path.join(repoRootNodeModules, '.modules.yaml'), { force: true });
  fs.rmSync(apiNodeModules, { recursive: true, force: true });
  execSync('pnpm install --prefer-offline --ignore-scripts', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}

console.log('Running prisma generate...');
execSync('pnpm run db:generate', {
  cwd: apiDir,
  stdio: 'inherit',
});

console.log('Bundling backend into self-contained dist/app.js with esbuild...');
const esbuild = require(
  require.resolve('esbuild', {
    paths: [pnpmVirtualNodeModules, apiNodeModules, repoRootNodeModules],
  })
);
const phcPath = require.resolve('@phc/format', {
  paths: [pnpmVirtualNodeModules, apiNodeModules, repoRootNodeModules],
});

const shimDir = path.join(os.tmpdir(), `permata-argon2-shim-${Date.now()}`);
fs.mkdirSync(shimDir, { recursive: true });
const shimFile = path.join(shimDir, 'argon2-shim.cjs');

fs.writeFileSync(
  shimFile,
  `
const crypto = require('crypto');
const { promisify } = require('util');
const phc = require(${JSON.stringify(phcPath)});
const cryptoArgon2 = promisify(crypto.argon2);
const types = Object.freeze({ argon2d: 0, argon2i: 1, argon2id: 2 });
const names = Object.freeze({ 0: 'argon2d', 1: 'argon2i', 2: 'argon2id' });
const defaults = Object.freeze({
  hashLength: 32,
  saltLength: 16,
  timeCost: 3,
  memoryCost: 65536,
  parallelism: 4,
  type: 2,
  version: 0x13,
});
async function hash(plain, opts = {}) {
  const o = { ...defaults, ...opts };
  const salt = o.salt || crypto.randomBytes(o.saltLength);
  const id = names[o.type] || 'argon2id';
  const derived = await cryptoArgon2(id, {
    message: Buffer.from(plain),
    nonce: salt,
    parallelism: o.parallelism,
    tagLength: o.hashLength,
    memory: o.memoryCost,
    passes: o.timeCost,
  });
  if (o.raw) return derived;
  return phc.serialize({
    id,
    version: o.version,
    params: { m: o.memoryCost, t: o.timeCost, p: o.parallelism },
    salt,
    hash: derived,
  });
}
async function verify(digest, plain) {
  const obj = phc.deserialize(digest);
  if (!(obj.id in types)) return false;
  const derived = await cryptoArgon2(obj.id, {
    message: Buffer.from(plain),
    nonce: obj.salt,
    parallelism: +obj.params.p,
    tagLength: obj.hash.length,
    memory: +obj.params.m,
    passes: +obj.params.t,
  });
  return crypto.timingSafeEqual(derived, obj.hash);
}
module.exports = { defaults, hash, verify, ...types };
`,
  'utf8'
);

const result = esbuild.buildSync({
  entryPoints: [path.join(apiDir, 'src/app.ts')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  write: false,
  alias: {
    argon2: shimFile,
  },
});

fs.rmSync(shimDir, { recursive: true, force: true });

const cjsCode = result.outputFiles[0].text;
const gzBase64 = zlib.gzipSync(Buffer.from(cjsCode, 'utf8')).toString('base64');

const distDir = path.join(apiDir, 'dist');
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const distAppPath = path.join(distDir, 'app.js');

const wrappedAppJs = [
  "const Module = require('module');",
  "const zlib = require('zlib');",
  `const BUNDLE_GZ_B64 = ${JSON.stringify(gzBase64)};`,
  "const m = new Module('/var/task/bundle.cjs');",
  "m.filename = '/var/task/bundle.cjs';",
  "m.paths = Module._nodeModulePaths('/var/task');",
  "m._compile(zlib.gunzipSync(Buffer.from(BUNDLE_GZ_B64, 'base64')).toString('utf8'), '/var/task/bundle.cjs');",
  'const app = m.exports.app || m.exports.default || m.exports;',
  'module.exports = app;',
  'module.exports.default = app;',
  'module.exports.app = app;',
].join('\n');

fs.writeFileSync(distAppPath, wrappedAppJs, 'utf8');

console.log(
  `Successfully bundled backend into dist/app.js (${(wrappedAppJs.length / 1024 / 1024).toFixed(2)} MB compressed).`
);
