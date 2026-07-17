import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { scrollToId } from "../../lib/scroll.js";
import "./Footer.css";

const RESEAUX_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" /></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4 0 4.38 2.4 4.38 5.5V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9s-2.03 1.38-2.03 2.8V21h-4z" /></svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 12s0-3.5-.45-5.1a2.6 2.6 0 0 0-1.83-1.83C19.1 4.6 12 4.6 12 4.6s-7.1 0-8.72.47A2.6 2.6 0 0 0 1.45 6.9C1 8.5 1 12 1 12s0 3.5.45 5.1a2.6 2.6 0 0 0 1.83 1.83C4.9 19.4 12 19.4 12 19.4s7.1 0 8.72-.47a2.6 2.6 0 0 0 1.83-1.83C23 15.5 23 12 23 12zM10 15.5v-7l6 3.5z" /></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.4.4 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c2 .8 2 .5 2.4.5a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" /></svg>
  ),
};

export default function Footer() {
  const { t } = useLangue();
  const annee = new Date().getFullYear();
  const reseaux = Object.entries(entreprise.reseaux).filter(([, url]) => url);

  return (
    <footer className="footer" id="contact">
      <div className="container">
        {/* Bandeau haut */}
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">{entreprise.nom}</span>
            <p className="footer__baseline">{t("footer.concept")}</p>
            {reseaux.length > 0 && (
              <div className="footer__social">
                {reseaux.map(([nom, url]) => (
                  <a key={nom} href={url} target="_blank" rel="noopener noreferrer" aria-label={nom} className="footer__social-link">
                    {RESEAUX_ICONS[nom] || nom}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>{t("footer.contact")}</h4>
              <a href={`tel:${entreprise.contact.telephoneLien}`}>{entreprise.contact.telephone}</a>
              <a href={`mailto:${entreprise.contact.email}`}>{entreprise.contact.email}</a>
              <span>
                {entreprise.contact.adresse}
                <br />
                {entreprise.contact.codePostal} {entreprise.contact.ville}
              </span>
            </div>

            <div className="footer__col">
              <h4>{t("footer.zone")}</h4>
              {entreprise.zoneIntervention.map((z) => (
                <span key={z}>{z}</span>
              ))}
            </div>

            <div className="footer__col">
              <h4>{t("footer.horaires")}</h4>
              <span>{entreprise.horaires.semaine}</span>
              <span>{entreprise.horaires.samedi}</span>
              <span>{entreprise.horaires.dimanche}</span>
              <a href="#devis" className="footer__cta" onClick={(e) => { e.preventDefault(); scrollToId("devis"); }}>
                {t("hero.cta")}
              </a>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="footer__bottom">
          <p>
            © {annee} {entreprise.legal.raisonSociale}. {t("footer.droits")}
          </p>
          <p className="footer__legal">
            SIRET {entreprise.legal.siret} · TVA {entreprise.legal.tva} · {entreprise.legal.assurance}
          </p>
        </div>
      </div>
    </footer>
  );
}
