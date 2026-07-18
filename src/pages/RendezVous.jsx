import { useLangue } from "../i18n/index.jsx";
import PageHero from "../components/PageHero/PageHero.jsx";
import TransitionLink from "../router/TransitionLink.jsx";
import "./page.css";

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
      <section className="section container page__placeholder">
        <p className="page__soon">{t("pages.bientot")}</p>
        <div className="page__links">
          <TransitionLink to="/notre-histoire" className="page__link">
            {t("nav.histoire")} →
          </TransitionLink>
          <TransitionLink to="/nos-piscines" className="page__link">
            {t("nav.nosPiscines")} →
          </TransitionLink>
        </div>
      </section>
    </article>
  );
}
