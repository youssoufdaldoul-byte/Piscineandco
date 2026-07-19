import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { usePageTransition } from "../../router/PageTransition.jsx";
import { resolveMedia } from "../../config/mediaRemote.js";
import LangSwitcher from "../LangSwitcher/LangSwitcher.jsx";
import "./Nav.css";

const LIENS = [
  { key: "accueil", to: "/", img: "/media/realisations/villa-eze.jpg" },
  { key: "histoire", to: "/notre-histoire", img: "/media/histoire/artisan.jpg" },
  { key: "nosPiscines", to: "/nos-piscines", img: "/media/realisations/saint-tropez.jpg" },
  { key: "rendezVous", to: "/rendez-vous", img: "/media/realisations/cap-ferrat.jpg" },
];

export default function Nav() {
  const { t } = useLangue();
  const { navigateTo } = usePageTransition();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(null); // index survolé (desktop)
  const overlayRef = useRef(null);
  const revealRef = useRef(null);
  const linksRef = useRef([]);

  // Image de fond active : lien survolé, sinon page courante
  const currentIndex = LIENS.findIndex((l) => l.to === location.pathname);
  const activeImg = hover != null ? hover : currentIndex >= 0 ? currentIndex : 0;

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
      setHover(null);
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex", pointerEvents: "auto" });
      if (reduce) {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(revealRef.current, { yPercent: -120 });
        gsap.set(linksRef.current, { opacity: 1, y: 0 });
      } else {
        gsap.set(overlay, { opacity: 1 });
        // Volet liquide turquoise : recouvre puis se retire vers le haut (révélation).
        // -120% : le panneau ET sa goutte (::after, 15vh) sortent entièrement du cadre.
        gsap.fromTo(
          revealRef.current,
          { yPercent: 0 },
          { yPercent: -120, duration: 0.85, ease: "power3.inOut" }
        );
        gsap.fromTo(
          linksRef.current,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.42 }
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
        {/* Base aquatique (visible derrière les photos) */}
        <div className="nav__overlay-bg" aria-hidden="true">
          <span className="nav__wave nav__wave--1" />
          <span className="nav__wave nav__wave--2" />
        </div>

        {/* Photos illustrant chaque lien (fondu enchaîné au survol) */}
        <div className="nav__images" aria-hidden="true">
          {LIENS.map((lien, i) => (
            <div
              key={lien.to}
              className={`nav__img ${i === activeImg ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${resolveMedia(lien.img)})` }}
            />
          ))}
        </div>
        <div className="nav__scrim" aria-hidden="true" />

        {/* Volet liquide de révélation */}
        <span className="nav__reveal" ref={revealRef} aria-hidden="true" />

        <nav className="nav__menu" onMouseLeave={() => setHover(null)}>
          <ul>
            {LIENS.map((lien, i) => (
              <li key={lien.to}>
                <button
                  ref={(el) => (linksRef.current[i] = el)}
                  className={`nav__link ${location.pathname === lien.to ? "is-current" : ""} ${lien.to === "/rendez-vous" ? "nav__link--cta" : ""}`}
                  onClick={() => goTo(lien.to)}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                >
                  <span className="nav__thumb" style={{ backgroundImage: `url(${resolveMedia(lien.img)})` }} aria-hidden="true" />
                  <span className="nav__link-num">0{i + 1}</span>
                  <span className="nav__link-label">{t(`nav.${lien.key}`)}</span>
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
