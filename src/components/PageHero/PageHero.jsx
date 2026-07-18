import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap.js";
import MediaImage from "../MediaImage/MediaImage.jsx";
import "./PageHero.css";

/**
 * Hero d'ouverture de page (un chapitre, pas un second climax).
 * Grande image atmosphérique + titre en fondu + translation vers le haut.
 *
 * props : eyebrow, titre, sousTitre, image, alt, ratio, children
 */
export default function PageHero({ eyebrow, titre, sousTitre, image, alt, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".page-hero__reveal");
      if (reduce) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(items, { opacity: 0, y: 44 });
      gsap.to(items, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", stagger: 0.14, delay: 0.2 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header className="page-hero" ref={ref}>
      <div className="page-hero__media">
        <MediaImage src={image} alt={alt || titre} ratio="large" eager />
        <div className="page-hero__scrim" />
      </div>
      <div className="page-hero__inner container">
        {eyebrow && <p className="page-hero__eyebrow page-hero__reveal">{eyebrow}</p>}
        <h1 className="page-hero__title page-hero__reveal">{titre}</h1>
        {sousTitre && <p className="page-hero__sub page-hero__reveal">{sousTitre}</p>}
        {children && <div className="page-hero__reveal">{children}</div>}
      </div>
    </header>
  );
}
