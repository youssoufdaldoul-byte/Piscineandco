/**
 * Défilement fluide vers une section par id.
 * Utilise Lenis si disponible (smooth scroll global), sinon repli natif.
 */
export function scrollToId(id, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, { offset, duration: 1.3 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default scrollToId;
