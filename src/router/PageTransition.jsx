import { createContext, useContext, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import "./PageTransition.css";

const Ctx = createContext(null);

/** Conserve le paramètre white-label ?client=<slug> sur une destination interne. */
function withClient(to) {
  if (typeof window === "undefined") return to;
  const client = new URLSearchParams(window.location.search).get("client");
  if (!client || to.includes("client=")) return to;
  return to + (to.includes("?") ? "&" : "?") + "client=" + encodeURIComponent(client);
}

/**
 * Transition de page cinématique : un bloom lumineux turquoise/blanc envahit
 * l'écran (avec une vague liquide), la route bascule au pic (masqué), puis le
 * bloom se dissipe. On a l'impression de traverser l'eau d'un chapitre à l'autre.
 */
export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);
  const bloomRef = useRef(null);
  const waveRef = useRef(null);
  const animating = useRef(false);

  const resetScroll = () => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  };

  const navigateTo = useCallback(
    (to) => {
      if (to === location.pathname) return;
      // White-label : on conserve ?client=<slug> à travers la navigation interne
      const dest = withClient(to);
      const overlay = overlayRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!overlay || reduce || animating.current) {
        navigate(dest);
        resetScroll();
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      animating.current = true;
      overlay.style.pointerEvents = "auto";

      const tl = gsap.timeline({
        onComplete: () => {
          animating.current = false;
          overlay.style.pointerEvents = "none";
        },
      });

      // 1) Le bloom + la vague envahissent (couverture)
      tl.set(waveRef.current, { yPercent: 100 })
        .to(bloomRef.current, { opacity: 1, duration: 0.4, ease: "power2.in" }, 0)
        .to(waveRef.current, { yPercent: 0, duration: 0.45, ease: "power3.inOut" }, 0)
        // 2) Bascule de route au pic (masquée)
        .add(() => {
          navigate(dest);
          resetScroll();
          ScrollTrigger.refresh();
        }, 0.45)
        // 3) Dissipation
        .to(waveRef.current, { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, 0.5)
        .to(bloomRef.current, { opacity: 0, duration: 0.45, ease: "power2.out" }, 0.55)
        .set(waveRef.current, { yPercent: 100 });
    },
    [navigate, location.pathname]
  );

  return (
    <Ctx.Provider value={{ navigateTo }}>
      {children}
      <div className="page-transition" ref={overlayRef} aria-hidden="true">
        <div className="page-transition__bloom" ref={bloomRef} />
        <div className="page-transition__wave" ref={waveRef} />
      </div>
    </Ctx.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePageTransition doit être utilisé dans <PageTransitionProvider>");
  return ctx;
}

export default PageTransitionProvider;
