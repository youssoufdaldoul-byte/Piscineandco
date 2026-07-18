import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { usePageTransition } from "../../router/PageTransition.jsx";
import LangSwitcher from "../LangSwitcher/LangSwitcher.jsx";
import "./Nav.css";

const LIENS = [
  { key: "accueil", to: "/" },
  { key: "histoire", to: "/notre-histoire" },
  { key: "nosPiscines", to: "/nos-piscines" },
  { key: "rendezVous", to: "/rendez-vous" },
];

export default function Nav() {
  const { t } = useLangue();
  const { navigateTo } = usePageTransition();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef([]);

  // Fond de la barre au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ouverture / fermeture animée de l'overlay
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.__lenis;

    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex", pointerEvents: "auto" });
      if (reduce) {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(linksRef.current, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(
          linksRef.current,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.15 }
        );
      }
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      if (reduce) {
        gsap.set(overlay, { display: "none", opacity: 0, pointerEvents: "none" });
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => gsap.set(overlay, { display: "none", pointerEvents: "none" }),
        });
      }
    }
  }, [open]);

  // Échap pour fermer
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (to) => {
    setOpen(false);
    navigateTo(to);
  };

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <button className="nav__logo" onClick={() => goTo("/")} aria-label={entreprise.nom}>
          {entreprise.nom}
        </button>

        <div className="nav__right">
          <div className="nav__lang-bar">
            <LangSwitcher variant="bar" />
          </div>
          <button className="nav__cta" onClick={() => goTo("/rendez-vous")}>
            {t("nav.devis")}
          </button>
          <button
            className={`nav__burger ${open ? "is-active" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t("nav.fermer") : t("nav.menu")}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Overlay plein écran */}
      <div className="nav__overlay" ref={overlayRef} aria-hidden={!open}>
        <div className="nav__overlay-bg" aria-hidden="true">
          <span className="nav__wave nav__wave--1" />
          <span className="nav__wave nav__wave--2" />
        </div>

        <nav className="nav__menu">
          <ul>
            {LIENS.map((lien, i) => (
              <li key={lien.to}>
                <button
                  ref={(el) => (linksRef.current[i] = el)}
                  className={`nav__link ${location.pathname === lien.to ? "is-current" : ""} ${lien.to === "/rendez-vous" ? "nav__link--cta" : ""}`}
                  onClick={() => goTo(lien.to)}
                >
                  <span className="nav__link-num">0{i + 1}</span>
                  {t(`nav.${lien.key}`)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__footer" ref={(el) => (linksRef.current[LIENS.length] = el)}>
          <LangSwitcher variant="menu" />
          <div className="nav__contact">
            <a href={`tel:${entreprise.contact.telephoneLien}`}>{entreprise.contact.telephone}</a>
            <a href={`mailto:${entreprise.contact.email}`}>{entreprise.contact.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
