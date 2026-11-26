import NavBar from "@/components/navigation";
import Hero from "@/components/hero";
import ProjectList from "@/components/project-list";
import { projects } from "@/content/projects";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="mx-auto min-h-screen w-full max-w-[58rem] px-4 sm:px-6">
        <Hero />

        <section id="about" className="mt-20 sm:mt-24 md:mt-32">
          <h2 className="mb-8 text-4xl font-hero sm:text-5xl md:mb-10 md:text-6xl">about</h2>

          <div className="flex flex-col gap-5 text-base leading-relaxed text-gray-300 sm:text-lg md:gap-6 md:text-xl">
            <p>
              I’m a fourth-year Computer Science student at Arizona State University,
              enrolled in Barrett, The Honors College and the Ira A. Fulton Schools of Engineering.
            </p>

            <p>
              I enjoy building practical, real-world software and learning by doing,
              especially in full-stack development and distributed systems.
              Through coursework and personal projects I’ve worked with React, Next.js, TypeScript, C#, C++, Java, ASP.NET, and SQL,
              and I like diving into new frameworks when a problem calls for it.
            </p>

            <p>
              I’m particularly interested in cross-platform development and building tools that make everyday tasks easier.
            </p>

            <p>
              Outside of code, I produce music, record videos, and enjoy electric longboarding.
            </p>
          </div>
        </section>

        <section id="projects" className="mt-20 sm:mt-24 md:mt-32">
          <h2 className="mb-8 text-4xl font-hero sm:text-5xl md:mb-10 md:text-6xl">projects</h2>
          <ProjectList projects={projects} />
        </section>

        <section id="contact" className="mt-20 pb-20 sm:mt-24 sm:pb-24 md:mt-32">
          <h2 className="mb-8 text-4xl font-hero sm:text-5xl md:mb-10 md:text-6xl">contact</h2>
          <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm sm:gap-10 sm:p-8 md:p-10">
            <div className="space-y-3">
              <p className="text-3xl font-title sm:text-4xl md:text-6xl">Get in touch with me.</p>
              <p className="px-1 text-base text-gray-200/90 sm:px-4 sm:text-lg md:p-5 md:text-xl">
                I'm open for work and seeking opportunities for hands-on experience.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <a
                href="mailto:contact@nickrodi.com"
                className="group relative inline-flex items-center overflow-hidden rounded-full px-3 py-1 text-base leading-none text-gray-200/90 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white sm:text-lg"
              >
                <span className="relative z-10">contact@nickrodi.com</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-[-60%] h-[220%] w-[45%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9),_rgba(255,255,255,0)_70%)] opacity-0 blur-[12px] transition-[left,opacity] duration-500 ease-out group-hover:left-[110%] group-hover:opacity-90"
                  style={{ mixBlendMode: "screen" }}
                />
              </a>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="https://github.com/nickrodii"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.32),_rgba(255,255,255,0.1))] hover:text-white sm:h-12 sm:w-12"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-5 w-5 sm:h-6 sm:w-6"
                  style={{
                    backgroundColor: "currentColor",
                    WebkitMaskImage: "url(/images/icons/github.svg)",
                    maskImage: "url(/images/icons/github.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </a>
              <a
                href="https://www.linkedin.com/in/nickrodi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(59,130,246,0.25),_rgba(255,255,255,0.1))] hover:text-white sm:h-12 sm:w-12"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-5 w-5 sm:h-6 sm:w-6"
                  style={{
                    backgroundColor: "currentColor",
                    WebkitMaskImage: "url(/images/icons/linkedin.svg)",
                    maskImage: "url(/images/icons/linkedin.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </a>
              <a
                href="https://x.com/nir_code"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.3),_rgba(255,255,255,0.1))] hover:text-white sm:h-12 sm:w-12"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-5 w-5 sm:h-6 sm:w-6"
                  style={{
                    backgroundColor: "currentColor",
                    WebkitMaskImage: "url(/images/icons/x.svg)",
                    maskImage: "url(/images/icons/x.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </a>
              <a
                href="https://modrinth.com/user/nickrodi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Modrinth"
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(27,217,106,0.25),_rgba(255,255,255,0.1))] hover:text-white sm:h-12 sm:w-12"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-5 w-5 sm:h-6 sm:w-6"
                  style={{
                    backgroundColor: "currentColor",
                    WebkitMaskImage: "url(/images/icons/modrinth.svg)",
                    maskImage: "url(/images/icons/modrinth.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
