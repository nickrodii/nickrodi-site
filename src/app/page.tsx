import Image from "next/image";
import NavBar from "@/components/navigation";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full mx-auto max-w-[90rem] px-16">
        <section id="hero" className="mx-auto mt-32">
          <div className="flex gap-16">
            <div className="max-w-md">
              {/* Left-side of hero */}
              <h1 className="text-white text-9xl font-bold font-plex-mono">hello, i'm nick</h1>
            </div>

            <div className="flex-1">
              {/* Right-side of hero */}
            </div>
          </div>
          
        </section>

        <section id="about" className="mt-32 min-h-[60vh]">
          <h2 className="text-4xl font-hero mb-12">about me</h2>

          <div className="flex flex-col gap-6 text-xl leading-relaxed text-gray-300">
            <p>
              I'm Nick, a Computer Science student at <span className="text-white font-semibold">Arizona State University</span> focusing on Software Engineering. 
              I'm passionate about building apps and exploring different languages to expand my knowledge on software development.
            </p>

            <p>
              My interest in tech started at age 7 with the family computer. I was fascinated by <strong>Windows Vista</strong>, spending hours exploring the OS functions I didn't understand. 
              I also discovered <strong>Scratch</strong>, which introduced me to event-driven programming concepts before I even knew what that meant. 
              I also ended up running a YouTube channel dedicated to messing around with Windows, which included a tutorial on how to delete System32 (do not delete System32 by the way).
            </p>

            <p>
              While high school formalized my coding knowledge with <strong>Java</strong>, my time at university has pushed me into notably C++ and C#, but a lot more languages from different paradigms. 
              Lately, I've shifted my focus to <strong>C#</strong> (which I honestly prefer over Java now) and I'm currently teaching myself <strong>Rust</strong> to dive into modern systems programming.
            </p>

            <p>
              Outside of development, my favorite hobby is producing music. I use <strong>FL Studio</strong> as a 
              creative outlet and have released multiple projects over the years. 
              I treat programming much the same way—it's just a different medium for that same 
              creative energy, allowing me to build something from nothing.
            </p>
</div>
        </section>

        <section id="projects" className="mt-32 min-h-[60vh]">
          <h2 className="text-4xl font-hero">my projects</h2>
        </section>

        <section id="contact" className="mt-32 min-h-[60vh]">
          <h2 className="text-4xl font-hero">contact me</h2>
        </section>
      </main>
    </>
  );
}
