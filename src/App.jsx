import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Hero from "./sections/Hero/Hero.jsx";
import Experience from "./sections/Experience/Experience.jsx";
import Realisations from "./sections/Realisations/Realisations.jsx";
import Histoire from "./sections/Histoire/Histoire.jsx";
import Avis from "./sections/Avis/Avis.jsx";
import Processus from "./sections/Processus/Processus.jsx";
import Devis from "./sections/Devis/Devis.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <main>
      <Hero />
      <Experience />
      <Realisations />
      <Histoire />
      <Avis />
      <Processus />
      <Devis />

      {/* Section à venir : Footer */}
    </main>
  );
}
