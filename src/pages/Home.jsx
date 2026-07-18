import Hero from "../sections/Hero/Hero.jsx";
import Experience from "../sections/Experience/Experience.jsx";
import Realisations from "../sections/Realisations/Realisations.jsx";
import Teaser from "../sections/Teaser/Teaser.jsx";
import Avis from "../sections/Avis/Avis.jsx";
import Processus from "../sections/Processus/Processus.jsx";
import Devis from "../sections/Devis/Devis.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Realisations />
      <Teaser />
      <Avis />
      <Processus />
      <Devis />
    </>
  );
}
