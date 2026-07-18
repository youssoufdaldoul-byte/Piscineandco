import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import PageHero from "../components/PageHero/PageHero.jsx";
import Reveal from "../components/Reveal/Reveal.jsx";
import "./rendez-vous.css";
import "./page.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useRdvForm() {
  const { t } = useLangue();
  const [params] = useSearchParams();
  const modeleParam = params.get("modele");
  const modeleValide = entreprise.piscines.modeles.some((m) => m.id === modeleParam);

  const [values, setValues] = useState({
    nom: "", telephone: "", email: "",
    typeProjet: modeleValide ? "construction" : "",
    modele: modeleValide ? modeleParam : "",
    commune: "", budget: "", message: "", creneau: "",
  });
  const [errors, setErrors] = useState({});
  const [statut, setStatut] = useState("idle"); // idle | sending | success | error

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const validate = () => {
    const e = {};
    if (!values.nom.trim()) e.nom = t("rdvPage.validation.requis");
    if (!values.telephone.trim()) e.telephone = t("rdvPage.validation.requis");
    else if ((values.telephone.replace(/[^0-9]/g, "").length) < 6) e.telephone = t("rdvPage.validation.tel");
    if (!values.email.trim()) e.email = t("rdvPage.validation.requis");
    else if (!EMAIL_RE.test(values.email)) e.email = t("rdvPage.validation.email");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    const endpointPret = entreprise.formulaire.endpoint && !entreprise.formulaire.endpoint.includes("VOTRE_ID");
    setStatut("sending");

    const payload = { ...values };
    if (!endpointPret) {
      setTimeout(() => setStatut("success"), 900);
      return;
    }
    try {
      const res = await fetch(entreprise.formulaire.endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatut(res.ok ? "success" : "error");
    } catch {
      setStatut("error");
    }
  };

  return { values, errors, statut, set, submit, t };
}

function Confirmation() {
  const { t } = useLangue();
  return (
    <div className="rdv-confirm" role="status">
      <div className="rdv-confirm__ripple" aria-hidden="true">
        <span /><span /><span />
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="rdv-confirm__titre">{t("rdvPage.confirmTitre")}</h3>
      <p className="rdv-confirm__texte">{t("rdvPage.confirmTexte")}</p>
    </div>
  );
}

function Champ({ id, label, error, children, optionnel }) {
  return (
    <div className={`rdv-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optionnel && <em> · {optionnel}</em>}
      </label>
      {children}
      {error && <span className="rdv-field__err">{error}</span>}
    </div>
  );
}

function Formulaire() {
  const { values, errors, statut, set, submit, t } = useRdvForm();
  const opt = t("rdvPage.optionnel");

  const onSubmit = (e) => { e.preventDefault(); submit(); };

  return (
    <section className="section rdv-form-section" id="formulaire">
      <div className="container">
        <header className="rdv-form__head">
          <Reveal as="p" className="eyebrow">{t("rdvPage.formEyebrow")}</Reveal>
          <Reveal as="h2" className="rdv-form__title" delay={0.05}>{t("rdvPage.formTitre")}</Reveal>
        </header>

        <Reveal className="rdv-form__card" delay={0.1}>
          {statut === "success" ? (
            <Confirmation />
          ) : (
            <form className="rdv-form" onSubmit={onSubmit} noValidate>
              <Champ id="nom" label={t("devis.champs.nom")} error={errors.nom}>
                <input id="nom" type="text" autoComplete="name" value={values.nom} onChange={(e) => set("nom", e.target.value)} />
              </Champ>

              <div className="rdv-row">
                <Champ id="tel" label={t("devis.champs.telephone")} error={errors.telephone}>
                  <input id="tel" type="tel" autoComplete="tel" value={values.telephone} onChange={(e) => set("telephone", e.target.value)} />
                </Champ>
                <Champ id="email" label={t("devis.champs.email")} error={errors.email}>
                  <input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
                </Champ>
              </div>

              <div className="rdv-row">
                <Champ id="type" label={t("devis.champs.typeProjet")}>
                  <select id="type" value={values.typeProjet} onChange={(e) => set("typeProjet", e.target.value)}>
                    <option value="">{t("rdvPage.choisir")}</option>
                    {["construction", "renovation", "entretien", "spa", "autre"].map((k) => (
                      <option key={k} value={k}>{t(`devis.typesProjet.${k}`)}</option>
                    ))}
                  </select>
                </Champ>
                <Champ id="modele" label={t("rdvPage.champs.modele")} optionnel={opt}>
                  <select id="modele" value={values.modele} onChange={(e) => set("modele", e.target.value)}>
                    <option value="">{t("rdvPage.indifferent")}</option>
                    {entreprise.piscines.modeles.map((m) => (
                      <option key={m.id} value={m.id}>{t(`piscinesPage.modeles.${m.id}.nom`)}</option>
                    ))}
                  </select>
                </Champ>
              </div>

              <div className="rdv-row">
                <Champ id="commune" label={t("rdvPage.champs.commune")} optionnel={opt}>
                  <input id="commune" type="text" value={values.commune} onChange={(e) => set("commune", e.target.value)} />
                </Champ>
                <Champ id="budget" label={t("rdvPage.champs.budget")} optionnel={opt}>
                  <select id="budget" value={values.budget} onChange={(e) => set("budget", e.target.value)}>
                    <option value="">{t("rdvPage.choisir")}</option>
                    {["b1", "b2", "b3", "b4"].map((b) => (
                      <option key={b} value={b}>{t(`rdvPage.budgets.${b}`)}</option>
                    ))}
                  </select>
                </Champ>
              </div>

              <Champ id="message" label={t("devis.champs.message")} optionnel={opt}>
                <textarea id="message" rows="4" placeholder={t("devis.placeholderMessage")} value={values.message} onChange={(e) => set("message", e.target.value)} />
              </Champ>

              <Champ label={t("rdvPage.champs.creneau")} optionnel={opt}>
                <div className="rdv-creneaux">
                  {["matin", "apresmidi", "soir"].map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`rdv-chip ${values.creneau === c ? "is-active" : ""}`}
                      onClick={() => set("creneau", values.creneau === c ? "" : c)}
                    >
                      {t(`rdvPage.creneaux.${c}`)}
                    </button>
                  ))}
                </div>
              </Champ>

              <button className="btn btn--solid rdv-submit" type="submit" disabled={statut === "sending"}>
                {statut === "sending" ? t("devis.envoi") : t("devis.envoyer")}
              </button>
              {statut === "error" && <p className="rdv-form__error" role="alert">{t("devis.erreur")}</p>}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const ETAPES = ["demande", "etude", "devis", "construction"];

function Etapes() {
  const { t } = useLangue();
  return (
    <section className="section rdv-etapes">
      <div className="container">
        <header className="rdv-etapes__head">
          <Reveal as="p" className="eyebrow">{t("rdvPage.etapesEyebrow")}</Reveal>
          <Reveal as="h2" className="rdv-etapes__title" delay={0.05}>{t("rdvPage.etapesTitre")}</Reveal>
        </header>
        <div className="rdv-etapes__grid">
          {ETAPES.map((e, i) => (
            <Reveal as="div" className="rdv-etape" key={e} delay={i * 0.08} y={40}>
              <span className="rdv-etape__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t(`rdvPage.etapes.${e}.titre`)}</h3>
              <p>{t(`rdvPage.etapes.${e}.texte`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactDirect() {
  const { t } = useLangue();
  const c = entreprise.contact;
  return (
    <section className="section rdv-contact">
      <div className="container rdv-contact__grid">
        <div>
          <Reveal as="p" className="eyebrow">{t("rdvPage.contactEyebrow")}</Reveal>
          <Reveal as="h2" className="rdv-contact__title" delay={0.05}>{t("rdvPage.contactTitre")}</Reveal>
          <Reveal className="rdv-contact__list" delay={0.1}>
            <a href={`tel:${c.telephoneLien}`} className="rdv-contact__line rdv-contact__phone">{c.telephone}</a>
            <a href={`mailto:${c.email}`} className="rdv-contact__line">{c.email}</a>
            <span className="rdv-contact__line">{c.adresse}, {c.codePostal} {c.ville}</span>
            <div className="rdv-contact__hours">
              <span>{entreprise.horaires.semaine}</span>
              <span>{entreprise.horaires.samedi}</span>
              <span>{entreprise.horaires.dimanche}</span>
            </div>
            <div className="rdv-contact__zone">{entreprise.zoneIntervention.join(" · ")}</div>
          </Reveal>
        </div>
        <Reveal className="rdv-map" delay={0.1}>
          <iframe
            title="Carte"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapsQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Reassurance() {
  const { t } = useLangue();
  const quotes = ["avis1", "avis2"];
  return (
    <section className="section rdv-reassurance">
      <div className="container">
        <header className="rdv-reassurance__head">
          <Reveal as="p" className="eyebrow">{t("rdvPage.reassuranceEyebrow")}</Reveal>
          <Reveal as="h2" className="rdv-reassurance__title" delay={0.05}>{t("rdvPage.reassuranceTitre")}</Reveal>
        </header>

        <Reveal className="rdv-stats" delay={0.1}>
          <div className="rdv-stat">
            <strong>{entreprise.stats.experience}</strong>
            <span>{t("rdvPage.experienceLabel")}</span>
          </div>
          <div className="rdv-stat">
            <strong>{entreprise.stats.realisations}</strong>
            <span>{t("rdvPage.realisationsLabel")}</span>
          </div>
          <div className="rdv-stat">
            <strong>10 ans</strong>
            <span>{t("rdvPage.garantieLabel")}</span>
          </div>
        </Reveal>

        <div className="rdv-quotes">
          {quotes.map((q, i) => (
            <Reveal as="blockquote" className="rdv-quote" key={q} delay={i * 0.1}>
              <span className="stars" aria-hidden="true">★★★★★</span>
              <p>{t(`avis.temoignages.${q}`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RendezVous() {
  const { t } = useLangue();
  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.rendezvous.eyebrow")}
        titre={t("pages.rendezvous.titre")}
        sousTitre={t("pages.rendezvous.sousTitre")}
        image="/media/services/entretien.jpg"
        alt={t("pages.rendezvous.titre")}
      />
      <Formulaire />
      <Etapes />
      <ContactDirect />
      <Reassurance />
    </article>
  );
}
