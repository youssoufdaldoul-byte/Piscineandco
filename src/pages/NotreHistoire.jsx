import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import PageHero from "../components/PageHero/PageHero.jsx";
import TransitionLink from "../router/TransitionLink.jsx";
import "./page.css";

export default function NotreHistoire() {
  const { t } = useLangue();
  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.histoire.eyebrow")}
        titre={t("pages.histoire.titre")}
        sousTitre={t("pages.histoire.sousTitre")}
        image={entreprise.medias.histoireImage}
        alt={entreprise.fondateur}
      />
      <section className="section container page__placeholder">
        <p className="page__soon">{t("pages.bientot")}</p>
        <div className="page__links">
          <TransitionLink to="/nos-piscines" className="page__link">
            {t("nav.nosPiscines")} →
          </TransitionLink>
          <TransitionLink to="/rendez-vous" className="page__link">
            {t("nav.rendezVous")} →
          </TransitionLink>
        </div>
      </section>
    </article>
  );
}
