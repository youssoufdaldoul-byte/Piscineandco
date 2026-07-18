import { usePageTransition } from "./PageTransition.jsx";

/**
 * Lien interne qui déclenche la transition cinématique de page.
 * Rend une balise <a> accessible (Cmd/Ctrl+clic → nouvel onglet natif).
 */
export default function TransitionLink({ to, className = "", children, onNavigate, ...rest }) {
  const { navigateTo } = usePageTransition();

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // laisse le comportement natif
    e.preventDefault();
    onNavigate?.();
    navigateTo(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
