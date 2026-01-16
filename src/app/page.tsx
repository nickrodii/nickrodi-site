import Image from "next/image";
import NavBar from "@/components/navigation";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full mx-auto max-w-[90rem] px-16">
        <section id="hero" className="mx-auto mt-50">
          <div className="flex gap-16">
            <div className="max-w-md">
              <h1 className="text-white font-bold font-plex-mono leading-tight">
                {/* Left-side of hero */}
                <span className="block text-6xl text-gray-400 mb-2">hello, i'm</span>
                <span className="block text-9xl">nick</span>
                <span className="block text-9xl">rodi</span>
              </h1>
            </div>

            <div className="flex-1">
              {/* Right-side of hero */}
            </div>
          </div>
          
        </section>

        <section id="about" className="mt-56 min-h-[60vh]">
          <h2 className="text-6xl font-hero mb-10">about</h2>

          <div className="flex flex-col gap-6 text-xl leading-relaxed text-gray-300">
            <p>
              I’m a Computer Science student (focusing on Software Engineering) at <span className="text-white font-semibold">Arizona State University</span>, 
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

        <section id="projects" className="mt-28 min-h-[60vh]">
          <h2 className="text-4xl font-hero mb-10">projects</h2>
        </section>

        <section id="contact" className="mt-28 min-h-[60vh]">
          <h2 className="text-4xl font-hero mb-10">contact</h2>
        </section>
      </main>
    </>
  );
}
