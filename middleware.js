/**
 * Vercel Edge Middleware — white-label côté serveur.
 *
 * Les crawlers (WhatsApp, Facebook, X…) n'exécutent PAS le JavaScript : ils
 * lisent le HTML initial. Pour que l'aperçu de lien affiche le nom du prospect,
 * on réécrit <title> + og: dans le HTML servi quand ?client=<slug> est présent.
 *
 * Aucun paramètre / slug inconnu → on laisse passer le site par défaut.
 */
import { prospects } from "./src/config/prospects.js";

export const config = { matcher: "/" };

export default async function middleware(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("client");
    const p = slug ? prospects[slug] : null;
    if (!p || !p.nom) return; // repli silencieux → site par défaut

    const res = await fetch(new URL("/index.html", url.origin));
    if (!res.ok) return;
    let html = await res.text();
    html = html.split("AZUR PISCINES").join(p.nom); // titre + og:title

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  } catch (_) {
    return; // fail-open : ne jamais casser le rendu
  }
}
