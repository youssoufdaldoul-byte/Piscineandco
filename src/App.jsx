import { Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import { PageTransitionProvider } from "./router/PageTransition.jsx";
import Ambiance from "./components/Ambiance/Ambiance.jsx";
import Nav from "./components/Nav/Nav.jsx";
import Footer from "./sections/Footer/Footer.jsx";
import Home from "./pages/Home.jsx";
import NotreHistoire from "./pages/NotreHistoire.jsx";
import NosPiscines from "./pages/NosPiscines.jsx";
import RendezVous from "./pages/RendezVous.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <PageTransitionProvider>
      <Ambiance />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notre-histoire" element={<NotreHistoire />} />
          <Route path="/nos-piscines" element={<NosPiscines />} />
          <Route path="/rendez-vous" element={<RendezVous />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </PageTransitionProvider>
  );
}
