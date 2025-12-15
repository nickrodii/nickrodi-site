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
          <h2 className="text-4xl font-hero">about me</h2>
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
