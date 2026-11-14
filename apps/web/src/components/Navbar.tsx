"use client";

import Link from "next/link";
import { Home, LayoutDashboard, BookOpen } from "lucide-react";
import { useCulture } from "@/context/CultureContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { culture, setCulture } = useCulture();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda", icon: <Home size={16} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/jurnal", label: "Jurnal", icon: <BookOpen size={16} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 bg-surface/80 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex justify-between items-center gap-6">
        {/* Wordmark */}
        <Link
          href="/"
          prefetch={false}
          className="text-lg font-semibold tracking-[0.08em] text-fg hover:text-fg-brand transition-colors duration-150"
        >
          PERMATA
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-tint text-fg-brand"
                    : "text-fg-muted hover:text-fg hover:bg-sunken"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Segmented control pemilih budaya */}
        <div
          className="flex items-center bg-sunken rounded-full p-1"
          role="group"
          aria-label="Konteks budaya"
        >
          {(["aceh", "sumbar"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCulture(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                culture === c
                  ? "bg-action text-white shadow-xs"
                  : "text-fg-muted hover:text-fg"
              }`}
              aria-pressed={culture === c}
            >
              {c === "aceh" ? "Aceh" : "Sumbar"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
