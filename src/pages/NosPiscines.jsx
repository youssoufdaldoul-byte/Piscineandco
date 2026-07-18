import { useLangue } from "../i18n/index.jsx";
import PageHero from "../components/PageHero/PageHero.jsx";
import TransitionLink from "../router/TransitionLink.jsx";
import "./page.css";

export default function NosPiscines() {
  const { t } = useLangue();
  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.piscines.eyebrow")}
        titre={t("pages.piscines.titre")}
        sousTitre={t("pages.piscines.sousTitre")}
        image="/media/realisations/villa-eze.jpg"
        alt={t("pages.piscines.titre")}
      />
      <section className="section container page__placeholder">
        <p className="page__soon">{t("pages.bientot")}</p>
        <div className="page__links">
          <TransitionLink to="/notre-histoire" className="page__link">
            {t("nav.histoire")} →
          </TransitionLink>
          <TransitionLink to="/rendez-vous" className="page__link">
            {t("nav.rendezVous")} →
          </TransitionLink>
        </div>
      </section>
    </article>
  );
}
