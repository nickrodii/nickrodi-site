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
        "sticky top-0 z-50 relative before:content-[''] before:absolute before:bg-inherit before:inset-x-0 before:-top-24 before:-z-10 before:h-24 before:bg-black/0 before:backdrop-blur transition-colors duration-200 ease-out",
        scrolled ? "bg-black/50 backdrop-blur-lg border-b border-white/10" : "border-b border-transparent",
      ].join(" ")}
    >
        <nav className="mx-auto max-w-[90rem] px-8 py-6 text-white ">
            <ul className="flex space-x-8 items-center gap-20">
                <li>
                    <a className="pr-6 mr-20 font-title text-4xl" href="#">nickrodi</a>
                </li>
                <li>
                    <a href="#about">about</a>
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