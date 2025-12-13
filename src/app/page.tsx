import Image from "next/image";
import NavBar from "@/components/navigation";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full mx-auto max-w-[90rem] px-16">
        <div className="mx-auto">
          <h1 className="text-white text-9xl font-bold font-plex-mono">hello</h1>
        </div>
      </main>
    </>
  );
}
