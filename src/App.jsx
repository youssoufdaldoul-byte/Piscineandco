import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Hero from "./sections/Hero/Hero.jsx";
import Experience from "./sections/Experience/Experience.jsx";
import Realisations from "./sections/Realisations/Realisations.jsx";
import Histoire from "./sections/Histoire/Histoire.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <main>
      <Hero />
      <Experience />
      <Realisations />
      <Histoire />

      {/* Sections à venir : Avis → Processus → Devis → Footer */}
    </main>
  );
}
