"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <Image
  src="/images/kora-logo-v2.png"
  alt="KORA"
  width={132}
  height={40}
  className="h-auto w-auto object-contain"
  priority
/>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#como-funciona" className="transition hover:text-white">
            Cómo funciona
          </a>
          <a href="#producto" className="transition hover:text-white">
            Producto
          </a>
          <a href="#marketplace" className="transition hover:text-white">
            Marketplace
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="http://localhost:5173/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ingresar
          </a>

          <Button href="#cta">Solicitar demo</Button>
        </div>
      </div>
    </header>
  );
}