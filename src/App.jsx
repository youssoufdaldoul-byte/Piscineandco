import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Hero from "./sections/Hero/Hero.jsx";
import Experience from "./sections/Experience/Experience.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <main>
      <Hero />
      <Experience />

      {/* Sections à venir : Réalisations → Histoire → Avis → Processus → Devis → Footer */}
    </main>
  );
}
