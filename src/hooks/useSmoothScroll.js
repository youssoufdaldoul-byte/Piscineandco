import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap.js";

/**
 * Smooth scroll global (Lenis) synchronisé avec GSAP ScrollTrigger.
 * - Respecte prefers-reduced-motion (désactive le lissage).
 * - Une seule instance pour toute l'app.
 * Retourne l'instance Lenis via un ref-like sur window pour un accès éventuel.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // scroll natif, pas de lissage

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Synchronise Lenis → ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Pilote Lenis via le ticker GSAP (une seule boucle RAF)
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}

export default useSmoothScroll;
