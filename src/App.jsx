import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Nav from "./components/Nav/Nav.jsx";
import Hero from "./sections/Hero/Hero.jsx";
import Experience from "./sections/Experience/Experience.jsx";
import Realisations from "./sections/Realisations/Realisations.jsx";
import Histoire from "./sections/Histoire/Histoire.jsx";
import Avis from "./sections/Avis/Avis.jsx";
import Processus from "./sections/Processus/Processus.jsx";
import Devis from "./sections/Devis/Devis.jsx";
import Footer from "./sections/Footer/Footer.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Realisations />
        <Histoire />
        <Avis />
        <Processus />
        <Devis />
      </main>
      <Footer />
    </>
  );
}
