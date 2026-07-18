import { useEffect, useRef } from "react";
import "./Ambiance.css";

/**
 * Ambiance de fond globale (fixée derrière tout le contenu).
 * - Dégradé de profondeur RÉACTIF AU SCROLL : le site traverse une journée
 *   (couchant chaud → bleu profond → turquoise → sable chaud).
 * - Caustiques CSS animées (lumière filtrée par l'eau, très basse opacité).
 * - Particules flottantes (canvas 2D léger : motes qui remontent).
 * - Vignette + grain film.
 * Respecte prefers-reduced-motion (fige les animations).
 */

// Étapes couleur du voyage (progression 0 → 1) : [glow, top, bottom] en "r,g,b"
const STOPS = [
  { p: 0.0, glow: "47,120,150", top: "11,24,36", bottom: "8,15,24" }, // sortie du plongeon : bleu nuit
  { p: 0.2, glow: "38,120,150", top: "16,44,62", bottom: "8,18,30" }, // expérience : lagon
  { p: 0.42, glow: "47,182,196", top: "18,86,112", bottom: "7,20,32" }, // réalisations : turquoise profond
  { p: 0.62, glow: "47,182,196", top: "22,96,120", bottom: "9,22,34" }, // avis
  { p: 0.8, glow: "120,170,175", top: "26,70,84", bottom: "12,24,32" }, // processus
  { p: 1.0, glow: "201,168,106", top: "40,44,50", bottom: "16,18,24" }, // devis/footer : sable chaud
];

function lerp(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}
function parse(s) {
  return s.split(",").map(Number);
}
function colorAt(prog) {
  let a = STOPS[0], b = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (prog >= STOPS[i].p && prog <= STOPS[i + 1].p) {
      a = STOPS[i];
      b = STOPS[i + 1];
      break;
    }
  }
  const span = b.p - a.p || 1;
  const t = Math.min(1, Math.max(0, (prog - a.p) / span));
  return {
    glow: lerp(parse(a.glow), parse(b.glow), t).join(","),
    top: lerp(parse(a.top), parse(b.top), t).join(","),
    bottom: lerp(parse(a.bottom), parse(b.bottom), t).join(","),
  };
}

export default function Ambiance() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  // Dégradé réactif au scroll
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let ticking = false;
    const apply = () => {
      ticking = false;
      // Le voyage couleur démarre à la 1re section de contenu (après le hero),
      // là où l'ambiance devient visible.
      const startEl = document.getElementById("experience");
      const start = startEl
        ? startEl.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6
        : 0;
      const end = document.documentElement.scrollHeight - window.innerHeight;
      const span = Math.max(1, end - start);
      const prog = Math.min(1, Math.max(0, (window.scrollY - start) / span));
      const c = colorAt(prog);
      el.style.setProperty("--amb-glow", c.glow);
      el.style.setProperty("--amb-top", c.top);
      el.style.setProperty("--amb-bottom", c.bottom);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Particules flottantes (canvas 2D)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    let w, h, dpr, particles, raf, running = true;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = mobile ? 18 : 34;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        speed: 6 + Math.random() * 16, // px/s vers le haut
        sway: 0.3 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.1 + Math.random() * 0.3,
      }));
    };

    let last = performance.now();
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!running) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.speed * dt;
        p.phase += dt * p.sway;
        const x = p.x + Math.sin(p.phase) * 14;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 240, 245, ${p.alpha})`;
        ctx.fill();
      }
    };

    init();
    raf = requestAnimationFrame(draw);
    const onResize = () => init();
    const onVis = () => { running = !document.hidden; last = performance.now(); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="ambiance" ref={rootRef} aria-hidden="true">
      <div className="amb__gradient" />
      <div className="amb__caustics" />
      <canvas className="amb__particles" ref={canvasRef} />
      <div className="amb__vignette" />
      <div className="amb__grain" />
    </div>
  );
}
