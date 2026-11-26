import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="mt-20 sm:mt-28 md:mt-36">
      <div className="flex flex-col gap-10 sm:gap-12 md:flex-row md:items-start md:justify-between md:gap-14">
        <div className="max-w-xl">
          <h1 className="font-plex-mono text-[2.1rem] leading-[1.15] text-white sm:text-5xl lg:text-[3.25rem]">
            Hi, I&apos;m Nick Rodi.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-300 sm:mt-6 sm:text-xl">
            I like to turn ambitious ideas into lasting software.
          </p>

          <p className="mt-7 font-plex-mono text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 sm:mt-8 sm:text-xs">
            Honors Software Engineer at{" "}
            <span className="text-yellow-100">Arizona State University</span>
          </p>
        </div>

        <div className="w-44 shrink-0 sm:w-48 lg:w-52">
          <div className="relative aspect-square overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            <Image
              src="/images/nick.jpg"
              alt="Nick Rodi"
              fill
              priority
              sizes="208px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
