import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Hero from "./sections/Hero/Hero.jsx";
import Experience from "./sections/Experience/Experience.jsx";
import Realisations from "./sections/Realisations/Realisations.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <main>
      <Hero />
      <Experience />
      <Realisations />

      {/* Sections à venir : Histoire → Avis → Processus → Devis → Footer */}
    </main>
  );
}
