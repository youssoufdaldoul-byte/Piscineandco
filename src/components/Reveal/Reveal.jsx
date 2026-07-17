import { useRef, useLayoutEffect, createElement } from "react";
import { gsap } from "../../lib/gsap.js";

/**
 * Révèle son contenu au scroll (fondu + léger glissement).
 * Respecte prefers-reduced-motion. Utilisable pour n'importe quelle balise via `as`.
 *
 * props : as, y (décalage px), delay, duration, className, once (défaut true)
 */
export default function Reveal({
  children,
  as = "div",
  y = 44,
  delay = 0,
  duration = 1.05,
  className = "",
  once = true,
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [y, delay, duration, once]);

  return createElement(as, { ref, className, ...rest }, children);
}
