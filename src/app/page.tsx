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
          <h2 className="text-6xl font-hero mb-10">about me</h2>

          <div className="flex flex-col gap-6 text-xl leading-relaxed text-gray-300">
            <p>
              I’m a Computer Science student (with a focus in software engineering) at <span className="text-white font-semibold">Arizona State University</span>, 
              currently building projects for the sole purpose of expanding my knowledge on languages.
            </p>

            <p>
              My projects often start as solutions to my own daily annoyances, 
              like building a wrapper tool because I was tired of using the command line for ffmpeg. 
              That mindset drives my current focus on C# for Windows apps and JavaScript for the web (including this site).
            </p>

            <p>
              I’ve been exploring the web and computers since 2012, starting with a fascination for Windows functions and building 
              simple games in Scratch. Learning Java in high school gave me a head start on OOP principles, but university pushed me 
              to expand into C++ and C#. Right now, I’m diving deeper into the ecosystems of JavaScript and web frameworks, always 
              looking for the next language that helps me build better tools.
            </p>

            <p>
              I also like to engage in other creative mediums beyond code. I produce music across a variety of genres and record and 
              edit content for YouTube. My favorite part of the process is always the construction of the media: taking ideas from my 
              own thoughts and building them from the ground up into something others can appreciate and enjoy..
            </p>
          </div>
        </section>

        <section id="projects" className="mt-28 min-h-[60vh]">
          <h2 className="text-4xl font-hero mb-10">my projects</h2>
        </section>

        <section id="contact" className="mt-28 min-h-[60vh]">
          <h2 className="text-4xl font-hero mb-10">contact me</h2>
        </section>
      </main>
    </>
  );
}
