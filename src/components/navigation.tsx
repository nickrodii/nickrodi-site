"use client";
import { useEffect, useState, type CSSProperties } from "react";

const tint = "rgba(255,255,255,0.01)";

const makeZoneStyle = (filterId: string): CSSProperties => ({
  backdropFilter: `url(#${filterId})`,
  WebkitBackdropFilter: `url(#${filterId})`,
  backgroundColor: tint,
});

const outerLeftStyle = makeZoneStyle("nav-shift-right");
const innerLeftStyle = makeZoneStyle("nav-shift-left");
const innerRightStyle = makeZoneStyle("nav-shift-right");
const outerRightStyle = makeZoneStyle("nav-shift-left");

export default function NavBar() {
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
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="nav-shift-right" x="-40%" y="-30%" width="180%" height="160%">
            <feFlood floodColor="rgb(255,128,0)" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="44"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="nav-shift-left" x="-40%" y="-30%" width="180%" height="160%">
            <feFlood floodColor="rgb(0,128,0)" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="44"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative isolate mx-auto w-full max-w-[58rem]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[25%]" style={outerLeftStyle} />
          <span aria-hidden="true" className="absolute inset-y-0 left-[25%] w-[25%]" style={innerLeftStyle} />
          <span aria-hidden="true" className="absolute inset-y-0 left-[50%] w-[25%]" style={innerRightStyle} />
          <span aria-hidden="true" className="absolute inset-y-0 left-[75%] w-[25%]" style={outerRightStyle} />
        </span>

        <nav
          className={[
            "relative z-10 w-full overflow-hidden rounded-full border border-white/22 bg-transparent",
            "transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.16)]",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-white/[0.015] backdrop-blur-[6px] backdrop-saturate-115"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-white/14"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-black/40"
            style={{
              WebkitMaskImage:
                "radial-gradient(92px 54px at 104% 4%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
              maskImage:
                "radial-gradient(92px 54px at 104% 4%, rgba(0,0,0,1) 16%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 30%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-black/36"
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
      </div>
    </header>
  );
}
