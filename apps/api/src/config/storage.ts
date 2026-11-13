import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';
import { env } from './env';

export const uploadsStorage = new Files({
  adapter: neon({ bucket: env.OBJECT_STORAGE_BUCKET || 'uploads' }),
});

