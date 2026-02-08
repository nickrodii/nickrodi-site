import NavBar from "@/components/navigation";
import HeroTyping from "@/components/hero-typing";
import ProjectLayout from "@/components/projectlayout";
import { projects } from "@/content/projects";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full mx-auto max-w-[90rem] px-16">
        <HeroTyping />

        <section id="about" className="mt-56 min-h-[60vh]">
          <h2 className="text-6xl font-hero mb-10">about</h2>

          <div className="flex flex-col gap-6 text-xl leading-relaxed text-gray-300">
            <p>
              I’m a Computer Science student (focusing on Software Engineering) at Arizona State University, 
              where I am enrolled in <span className="text-white">Barrett, The Honors College</span> and the Ira A. Fulton Schools of Engineering.
            </p>

            <p>
              Recently, I’ve been building software applications to test my understanding of different tech stacks. 
              I have a background in object-oriented languages like <span className="text-white">Java, C++, and C#</span>, 
              as well as modern web frameworks and languages like <span className="text-white">Next.js, React, JavaScript, and TypeScript</span>.
            </p>

            <p>
              Outside of code, I produce music, record videos, and enjoy electric longboarding.
            </p>

            <p>
              I am currently seeking a <span className="text-white font-semibold">Software Engineering internship for Summer 2025</span>. 
              I want to work alongside experienced engineers to contribute to real projects and continue growing as a developer.
            </p> 
          </div>
        </section>

        <section id="projects" className="mt-16 min-h-[60vh]">
          <h2 className="text-6xl font-hero mb-10">projects</h2>
          <ProjectLayout projects={projects} />
        </section>

        <section id="contact" className="mt-16 min-h-[60vh]">
          <h2 className="text-6xl font-hero mb-10">contact</h2>
          <div className="flex flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
            <div className="space-y-3">
              <p className="text-5xl font-title md:text-6xl">Get in touch with me.</p>
              <p className="text-xl p-5 text-gray-200/90">
                I'm open for work and seeking opportunities for hands-on experience.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <a
                href="mailto:nickjrodi@gmail.com"
                className="group relative inline-flex items-center overflow-hidden rounded-full px-3 py-1 text-lg leading-none text-gray-200/90 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white"
              >
                <span className="relative z-10">nickjrodi@gmail.com</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-[-60%] h-[220%] w-[45%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9),_rgba(255,255,255,0)_70%)] opacity-0 blur-[12px] transition-[left,opacity] duration-500 ease-out group-hover:left-[110%] group-hover:opacity-90"
                  style={{ mixBlendMode: "screen" }}
                />
              </a>
              <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/nickrodii"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.32),_rgba(255,255,255,0.1))] hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-6 w-6"
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
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(59,130,246,0.25),_rgba(255,255,255,0.1))] hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-6 w-6"
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
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.3),_rgba(255,255,255,0.1))] hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-6 w-6"
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
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-[linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(27,217,106,0.25),_rgba(255,255,255,0.1))] hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-6 w-6"
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
