import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import "./ProjetComparateur.css";

/**
 * Comparateur AVANT / APRÈS — poignée verticale glissante.
 * - Souris + tactile (Pointer Events), clic direct, clavier (flèches).
 * - Balayage de démonstration automatique à l'ouverture.
 * - Révélation par clip-path : la couche AVANT est rognée à gauche de la poignée.
 */
export default function ProjetComparateur({ avant, apres, labelAvant, labelApres, hint }) {
  const wrapRef = useRef(null);
  const sweepRef = useRef(null);
  const interactedRef = useRef(false);
  const [pos, setPos] = useState(50); // % visible de l'image AVANT (depuis la gauche)
  const [touched, setTouched] = useState(false);

  const setFromClientX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const stopSweep = useCallback(() => {
    if (sweepRef.current) {
      sweepRef.current.kill();
      sweepRef.current = null;
    }
  }, []);

  const markTouched = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      setTouched(true);
      stopSweep();
    }
  }, [stopSweep]);

  // Balayage de démonstration à l'ouverture (nouveau projet)
  useEffect(() => {
    interactedRef.current = false;
    setTouched(false);
    setPos(50);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const proxy = { v: 50 };
    stopSweep();
    sweepRef.current = gsap
      .timeline({ defaults: { ease: "sine.inOut", onUpdate: () => setPos(proxy.v) } })
      .to(proxy, { v: 72, duration: 0.9 }, 0.35)
      .to(proxy, { v: 28, duration: 1.1 })
      .to(proxy, { v: 50, duration: 0.8 });
    return stopSweep;
  }, [avant, apres, stopSweep]);

  // Glisser (pointer)
  const onPointerDown = (e) => {
    markTouched();
    setFromClientX(e.clientX);
    const move = (ev) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") { markTouched(); setPos((p) => Math.max(0, p - step)); e.preventDefault(); }
    else if (e.key === "ArrowRight") { markTouched(); setPos((p) => Math.min(100, p + step)); e.preventDefault(); }
    else if (e.key === "Home") { markTouched(); setPos(0); e.preventDefault(); }
    else if (e.key === "End") { markTouched(); setPos(100); e.preventDefault(); }
  };

  return (
    <div
      className="cmp"
      ref={wrapRef}
      onPointerDown={onPointerDown}
    >
      {/* APRÈS (couche de fond, pleine) */}
      <img className="cmp__img" src={resolveMedia(apres)} alt={labelApres} draggable="false" />
      {/* AVANT (couche du dessus, rognée à gauche de la poignée) */}
      <img
        className="cmp__img cmp__img--avant"
        src={resolveMedia(avant)}
        alt={labelAvant}
        draggable="false"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Étiquettes de coin */}
      <span className="cmp__tag cmp__tag--left">{labelAvant}</span>
      <span className="cmp__tag cmp__tag--right">{labelApres}</span>

      {/* Poignée */}
      <div
        className="cmp__handle"
        style={{ left: `${pos}%` }}
        role="slider"
        aria-label={hint}
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className="cmp__line" />
        <span className="cmp__grip">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M14 7l-5 5 5 5M10 7l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Indice de glissement (disparaît à la première interaction) */}
      <span className={`cmp__hint ${touched ? "is-hidden" : ""}`}>{hint}</span>
    </div>
  );
}
