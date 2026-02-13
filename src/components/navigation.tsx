"use client";
import { useEffect, useState } from "react";

export default function NavBar () {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-4 z-50 px-4",
        "transition-all duration-300 ease-out",
        scrolled ? "py-1" : "py-2",
      ].join(" ")}
    >
      <nav
        className={[
          "relative isolate mx-auto w-full max-w-[58rem] overflow-hidden rounded-full",
          "backdrop-blur-[20px] backdrop-saturate-150 transition-all duration-300 ease-out",
          "shadow-[0_10px_24px_rgba(0,0,0,0.38)]",
          scrolled
            ? "bg-black/24"
            : "bg-black/18",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-white/22"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-black/42"
          style={{
            WebkitMaskImage:
              "radial-gradient(92px 54px at 104% 4%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
            maskImage:
              "radial-gradient(92px 54px at 104% 4%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-black/38"
          style={{
            WebkitMaskImage:
              "radial-gradient(92px 54px at 0% 100%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
            maskImage:
              "radial-gradient(92px 54px at 0% 100%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
          }}
        />
        <ul className="relative z-10 flex items-center justify-between gap-3 px-5 py-3 text-white md:gap-6 md:px-7">
          <li>
            <a className="font-title text-xl leading-none text-white md:text-2xl" href="#">
              nickrodi
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="rounded-full px-2 py-1 text-xs uppercase tracking-[0.22em] text-white/90 transition-colors hover:text-white md:text-sm"
            >
              about
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className="rounded-full px-2 py-1 text-xs uppercase tracking-[0.22em] text-white/90 transition-colors hover:text-white md:text-sm"
            >
              projects
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="rounded-full px-2 py-1 text-xs uppercase tracking-[0.22em] text-white/90 transition-colors hover:text-white md:text-sm"
            >
              contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
