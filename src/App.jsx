import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import Hero from "./sections/Hero/Hero.jsx";
import { entreprise } from "./config/entreprise.js";

export default function App() {
  useSmoothScroll();

  return (
    <>
      <main>
        <Hero />

        {/* Section suivante provisoire (sera remplacée par « L'Expérience »).
            Présente pour tester la transition et le scroll. */}
        <section
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "var(--section-y) var(--pad-x)",
            textAlign: "center",
          }}
        >
          <div>
            <p className="eyebrow">Section suivante</p>
            <h2 style={{ fontSize: "var(--fs-h2)", marginTop: "1rem" }}>
              {entreprise.slogan}
            </h2>
            <p style={{ marginTop: "1rem", color: "var(--c-texte-doux)" }}>
              La section « L'expérience » viendra ici après validation du Hero.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
