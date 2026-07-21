/**
 * Moteur de recommandation du quiz « Quel bassin ? ».
 * Entièrement piloté par la config (entreprise.quiz) — aucune règle en dur ici.
 *
 * @param {Object} answers  ex. { usage:"vue", terrain:"pente", envies:["nage"] }
 * @param {Object} quiz     entreprise.quiz (bassins, tieBreak, scores)
 * @returns {{scores:Object, ordre:string[], winner:string, runnerUp:string}}
 *   Toujours un résultat valide : winner ≠ runnerUp, jamais d'état vide.
 */
export function recommander(answers, quiz) {
  const bassins = quiz?.bassins || [];
  const scores = Object.fromEntries(bassins.map((b) => [b, 0]));

  for (const [qid, val] of Object.entries(answers || {})) {
    const table = quiz?.scores?.[qid];
    if (!table) continue;
    const picks = Array.isArray(val) ? val : [val];
    for (const opt of picks) {
      const poids = table[opt];
      if (!poids) continue;
      for (const [b, pts] of Object.entries(poids)) {
        if (b in scores) scores[b] += pts;
      }
    }
  }

  // Tri : score décroissant, puis ordre de préférence (départage déterministe).
  const rang = quiz?.tieBreak?.length ? quiz.tieBreak : bassins;
  const ordre = [...bassins].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return rang.indexOf(a) - rang.indexOf(b);
  });

  return { scores, ordre, winner: ordre[0], runnerUp: ordre[1] };
}

export default recommander;
