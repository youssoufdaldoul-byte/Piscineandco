/**
 * White-label : lit ?client=<slug> et fusionne la fiche prospect PAR-DESSUS
 * la config par défaut (nom, ville, téléphone uniquement). Slug inconnu ou
 * absent → repli silencieux sur le défaut, jamais d'erreur ni de nom vide.
 *
 * Mutation du singleton `entreprise` : tous les composants qui lisent
 * entreprise.nom / entreprise.contact.* reçoivent la surcharge sans autre
 * modification. Met aussi à jour <title> + og: (côté client, pour l'onglet ;
 * l'aperçu réseaux sociaux est géré côté serveur par middleware.js).
 */
import { entreprise } from "./entreprise.js";
import { prospects } from "./prospects.js";

export function getClientSlug() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("client");
}

export function applyProspect() {
  if (typeof window === "undefined") return;
  const slug = getClientSlug();
  const p = slug ? prospects[slug] : null;
  if (!p) return; // repli silencieux

  const defautNom = entreprise.nom;
  if (p.nom && p.nom.trim()) entreprise.nom = p.nom.trim();
  if (p.ville && p.ville.trim()) entreprise.contact.ville = p.ville.trim();
  if (p.telephone && p.telephone.trim()) {
    entreprise.contact.telephone = p.telephone.trim();
    entreprise.contact.telephoneLien = p.telephone.replace(/[^0-9+]/g, "");
  }

  if (entreprise.nom !== defautNom) updateMeta(defautNom, entreprise.nom);
}

function replaceContent(sel, from, to) {
  const el = document.querySelector(sel);
  if (!el) return;
  const c = el.getAttribute("content") || "";
  if (c.includes(from)) el.setAttribute("content", c.split(from).join(to));
}

function updateMeta(from, to) {
  try {
    if (document.title.includes(from)) document.title = document.title.split(from).join(to);
    replaceContent('meta[property="og:title"]', from, to);
    replaceContent('meta[property="og:description"]', from, to);
    replaceContent('meta[name="description"]', from, to);
  } catch (_) { /* DOM indisponible */ }
}

export default applyProspect;
