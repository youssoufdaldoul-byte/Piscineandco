import { useState } from "react";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Devis.css";

const TYPES = ["construction", "renovation", "entretien", "spa", "autre"];

export default function Devis() {
  const { t } = useLangue();
  const [statut, setStatut] = useState("idle"); // idle | sending | success | error

  const endpointPret =
    entreprise.formulaire.endpoint &&
    !entreprise.formulaire.endpoint.includes("VOTRE_ID");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Endpoint non configuré : on simule un succès pour la démo
    if (!endpointPret) {
      setStatut("sending");
      setTimeout(() => {
        setStatut("success");
        form.reset();
      }, 900);
      return;
    }

    setStatut("sending");
    try {
      const res = await fetch(entreprise.formulaire.endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatut("success");
        form.reset();
      } else {
        setStatut("error");
      }
    } catch {
      setStatut("error");
    }
  };

  return (
    <section className="section devis" id="devis">
      <div className="container devis__grid">
        {/* Colonne argument + coordonnées */}
        <div className="devis__aside">
          <Reveal as="p" className="eyebrow">
            {t("devis.eyebrow")}
          </Reveal>
          <Reveal as="h2" className="devis__title" delay={0.05}>
            {t("devis.titre")}
          </Reveal>
          <Reveal as="p" className="devis__intro" delay={0.1}>
            {t("devis.intro")}
          </Reveal>

          <Reveal className="devis__badge" delay={0.15} y={20}>
            <span className="devis__badge-num">{entreprise.formulaire.delaiReponse}</span>
            <span className="devis__badge-txt">{t("devis.badge")}</span>
          </Reveal>

          <div className="devis__coords">
            <a className="devis__coord" href={`tel:${entreprise.contact.telephoneLien}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {entreprise.contact.telephone}
            </a>
            <a className="devis__coord" href={`mailto:${entreprise.contact.email}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {entreprise.contact.email}
            </a>
            <div className="devis__coord">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {entreprise.zoneIntervention.slice(0, 5).join(" · ")}
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <Reveal className="devis__form-wrap" delay={0.1}>
          {statut === "success" ? (
            <div className="devis__success" role="status">
              <span className="devis__check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <p>{t("devis.succes")}</p>
            </div>
          ) : (
            <form className="devis__form" onSubmit={handleSubmit}>
              <div className="devis__field">
                <label htmlFor="nom">{t("devis.champs.nom")}</label>
                <input id="nom" name="nom" type="text" required autoComplete="name" />
              </div>

              <div className="devis__row">
                <div className="devis__field">
                  <label htmlFor="tel">{t("devis.champs.telephone")}</label>
                  <input id="tel" name="telephone" type="tel" required autoComplete="tel" />
                </div>
                <div className="devis__field">
                  <label htmlFor="email">{t("devis.champs.email")}</label>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>

              <div className="devis__field">
                <label htmlFor="type">{t("devis.champs.typeProjet")}</label>
                <select id="type" name="type_projet" defaultValue="">
                  <option value="" disabled>
                    —
                  </option>
                  {TYPES.map((ty) => (
                    <option key={ty} value={ty}>
                      {t(`devis.typesProjet.${ty}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="devis__field">
                <label htmlFor="message">{t("devis.champs.message")}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder={t("devis.placeholderMessage")}
                />
              </div>

              <button className="devis__submit" type="submit" disabled={statut === "sending"}>
                {statut === "sending" ? t("devis.envoi") : t("devis.envoyer")}
              </button>

              {statut === "error" && (
                <p className="devis__error" role="alert">
                  {t("devis.erreur")}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
