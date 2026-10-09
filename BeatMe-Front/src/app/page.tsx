import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Home from "@/components/Home/principal/home"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
          <Hero />
          <Home />
      </main>
    </>
  );
}
