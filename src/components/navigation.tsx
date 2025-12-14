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
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled ? "bg-black/70 backdrop-blur border-b border-white/10" : "border-b border-transparent",
      ].join(" ")}
    >

      
        <nav className="mx-auto max-w-[90rem] px-8 py-6 text-white ">
            <ul className="flex space-x-8 items-center gap-20">
                <li>
                    <a className="pr-6 mr-20 font-title text-4xl" href="https://nickrodi.com">nickrodi</a>
                </li>
                <li>
                    <a className="font-[var(--font-main)]" href="#about">about</a>
                </li>
                <li>
                    <a href="#projects">projects</a>
                </li>
                <li>
                    <a href="#contact">contact</a>
                </li>
            </ul>
        </nav>
    </header>
    );
}