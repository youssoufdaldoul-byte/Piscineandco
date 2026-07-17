import { useState } from "react";
import { resolveMedia } from "../../config/mediaRemote.js";
import "./MediaImage.css";

/**
 * Image avec placeholder élégant.
 * - Tente de charger `src`. Si le fichier n'existe pas encore (média à fournir),
 *   affiche un dégradé aquatique cohérent avec la charte + un label.
 * - Dès que le média réel est déposé, l'image s'affiche sans changer le code.
 *
 * props :
 *   src, alt, label (texte du placeholder), sub (sous-texte optionnel),
 *   ratio ("portrait" | "paysage" | "carre"), className, eager (chargement immédiat)
 */

// Dégradé déterministe à partir du label → variété cohérente entre tuiles
function gradientFor(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const a = 180 + (h % 40); // teintes lagon/turquoise
  const b = 190 + ((h * 3) % 30);
  return `linear-gradient(135deg,
    hsl(${a}, 45%, 16%) 0%,
    hsl(${b}, 55%, 26%) 55%,
    hsl(${b}, 60%, 38%) 100%)`;
}

const RATIOS = {
  portrait: "3 / 4",
  paysage: "16 / 10",
  carre: "1 / 1",
  large: "16 / 9",
};

export default function MediaImage({
  src,
  alt = "",
  label = "",
  sub = "",
  ratio = "paysage",
  className = "",
  eager = false,
  showLabel = true,
}) {
  const resolvedSrc = resolveMedia(src);
  const [errored, setErrored] = useState(!resolvedSrc);

  return (
    <div
      className={`media-img ${className}`}
      style={{ aspectRatio: RATIOS[ratio] || RATIOS.paysage }}
    >
      {!errored && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setErrored(true)}
          className="media-img__img"
        />
      )}

      {errored && (
        <div
          className="media-img__placeholder"
          style={{ background: gradientFor(label || alt) }}
          role="img"
          aria-label={alt || label}
        >
          <span className="media-img__shine" aria-hidden="true" />
          <span className="media-img__wave" aria-hidden="true" />
          {showLabel && (label || sub) && (
            <span className="media-img__label">
              {label}
              {sub && <em>{sub}</em>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
