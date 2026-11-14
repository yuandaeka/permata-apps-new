"use client";

import React from "react";
import { useCulture } from "@/context/CultureContext";
import { ShieldCheck, BrainCircuit, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import permataImg from "@/assets/permata.png";

const LandingPage = () => {
  const { culture } = useCulture();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
      {/* Hero section */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-6 block">
            Integrasi Pendidikan Resiliensi Mental
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-tight font-semibold tracking-tight mb-8">
            Membangun <br /> Ketahanan{" "}
            <span className="font-serif italic text-fg-brand">
              Di Dalam Jiwa.
            </span>
          </h1>
          <p className="text-lg text-fg-muted leading-relaxed max-w-[65ch] text-left mb-10">
            PERMATA mendekonstruksi pendekatan klinis Barat menjadi metode
            humanis berbasis kearifan lokal untuk pertumbuhan mental
            pasca-trauma.
          </p>
          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-action text-white font-medium hover:bg-action-hover transition-colors duration-200 group"
          >
            Mulai Pemulihan
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="rounded-xl border border-line shadow-md aspect-[4/5] overflow-hidden relative">
          <Image
            src={permataImg}
            className="w-full h-full object-cover"
            alt="PERMATA Project Contextual"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Feature cards */}
      <div className="mt-24 grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<ShieldCheck size={22} />}
          title="Geo-Cultural Tagging"
          desc="Penyesuaian interface berdasarkan kearifan lokal Aceh dan Sumatera (Meunasah/Rumah Gadang)."
        />
        <Link href="/jurnal" prefetch={false} className="block group">
          <CardAI
            icon={<BrainCircuit size={22} />}
            title="AI Jurnal Hikmah"
            desc="Transformasi trauma menjadi makna melalui narasi reflektif berbasis AI sesuai siklus Trauma-Informed Care."
          />
        </Link>
        <FeatureCard
          icon={<Users size={22} />}
          title="Saweu Syedara"
          desc="Ruang dukungan sebaya anonim berbasis kearifan lokal (Badunsanak) untuk resiliensi kolektif."
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-line py-16 mt-24">
        <div className="grid md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-2">
            <h4 className="text-xl font-semibold tracking-[0.08em] text-fg mb-4">
              PERMATA
            </h4>
            <p className="max-w-xs leading-relaxed text-fg-muted">
              Platform integrasi pendidikan resiliensi mental untuk pertumbuhan
              pasca-trauma berbasis kearifan lokal Nusantara.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-4">
              Navigasi
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  prefetch={false}
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/jurnal"
                  prefetch={false}
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                >
                  Jurnal Hikmah
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-4">
              Dukungan
            </h5>
            <ul className="space-y-3 text-sm text-fg-muted">
              <li>Pusat Bantuan</li>
              <li>Kebijakan Privasi</li>
              <li>2026 PERMATA Project</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-line flex justify-between items-center">
          <span className="text-sm text-fg-muted">Inovasi Resiliensi Mental</span>
          <span className="text-sm text-fg-muted">Indonesia Tangguh</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="w-11 h-11 bg-tint rounded-md flex items-center justify-center mb-4 text-fg-brand">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-fg mb-2">{title}</h3>
    <p className="text-sm text-fg-muted text-left leading-relaxed">{desc}</p>
  </div>
);

const CardAI = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-emphasis text-white rounded-lg p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
    <div className="w-11 h-11 bg-white/10 rounded-md flex items-center justify-center mb-4 text-accent-200">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-white/85 text-left leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
