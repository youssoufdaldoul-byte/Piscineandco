import { useRef, useLayoutEffect, createElement } from "react";
import { gsap } from "../../lib/gsap.js";

/**
 * Révèle un texte par un masque qui balaie de la gauche (clip-path wipe).
 * Pour les grands titres (noms de modèles). Respecte prefers-reduced-motion.
 */
export default function MaskReveal({ as = "div", className = "", children, delay = 0, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(el, { clipPath: "inset(0 0 0 0)" });
        return;
      }
      gsap.fromTo(
        el,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return createElement(as, { ref, className, ...rest }, children);
}
