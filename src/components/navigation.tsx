"use client";
import { useEffect, useState } from "react";
import { LiquiGlass } from "@/vendor/liqui-glass";

type NavBarProps = {
  anchorPrefix?: string;
};

const links = [
  { href: "#about", label: "about" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

export default function NavBar({ anchorPrefix = "" }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-site-nav="true"
      className={[
        "sticky top-3 z-50 px-3 sm:top-4 sm:px-4",
        "transition-all duration-300 ease-out",
        scrolled ? "py-1" : "py-2",
      ].join(" ")}
    >
      <LiquiGlass
        className="mx-auto w-full max-w-[58rem] text-white"
        contentClassName="w-full"
        material="auto"
        profile="squircle"
        radius={999}
        bezel={18}
        refraction={66}
        blur={1}
        frost={0.06}
        specular={0.05}
        dispersion={0}
        saturation={1.1}
        elevated
      >
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:justify-between sm:gap-3 sm:px-5 md:gap-6 md:px-7">
            <li className="basis-full text-center sm:basis-auto sm:text-left">
              <a
                className="font-title text-xl leading-none text-white sm:text-[1.35rem] md:text-2xl"
                href={anchorPrefix ? `${anchorPrefix}` : "#"}
              >
                nickrodi
              </a>
            </li>
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={`${anchorPrefix}${href}`}
                  className="rounded-full px-2 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-white sm:text-xs sm:tracking-[0.22em] md:text-sm"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </LiquiGlass>
    </header>
  );
}
