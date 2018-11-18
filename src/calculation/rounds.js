import { keyExists } from "../helpers/arrayHelpers";
import SCORE_VALUES from "../enums/scoreValues";

// Use a reducer. Why? No idea, will research why...
// Perhaps flatten array first?
// Map it back to store directly?
export default rounds => {
  // Set up a demo store (will use redux)
  let store = [];

  rounds.forEach(({ matches }) => {
    matches.forEach(({ team1, team2, score1, score2 }) => {
      // If the team hasn't been created in the store yet, then we create it. Ensuring to place
      // the expected tabular properties before-hand.
      if (!keyExists(store, team1.key)) {
        let win = score1 > score2,
          lose = score1 < score2,
          draw = score1 === score2;

        store.push({
          ...team1,
          rank: 0,
          totalWins: win ? 1 : 0,
          totalDraws: draw ? 1 : 0,
          totalDefeats: lose ? 1 : 0,
          goalsFor: score1,
          goalsAgainst: score2,
          goalDifference: 0,
          points: 0
        });
      } else {
        let win = score1 > score2,
          lose = score1 < score2,
          draw = score1 === score2;

        // Let's use redux to keep this stuff immutable and single source of truth
        // This causes errors if items are undefined, perhaps make this fail more nicely.
        store = store.map(item => {
          const {
            key,
            totalWins,
            totalDefeats,
            totalDraws,
            goalsFor,
            goalsAgainst
          } = item;

          if (key === team1.key) {
            return {
              ...item,
              totalWins: win ? totalWins + 1 : totalWins,
              totalDraws: draw ? totalDraws + 1 : totalDraws,
              totalDefeats: lose ? totalDefeats + 1 : totalDefeats,
              goalsFor: goalsFor + score1,
              goalsAgainst: goalsAgainst + score2
            };
          } else {
            return {
              ...item
            };
          }
        });
      }

      if (!keyExists(store, team2.key)) {
        let win = score2 > score1,
          lose = score2 < score1,
          draw = score2 === score1;

        store.push({
          ...team2,
          rank: 0,
          totalWins: win ? 1 : 0,
          totalDraws: draw ? 1 : 0,
          totalDefeats: lose ? 1 : 0,
          goalsFor: score2,
          goalsAgainst: score1,
          goalDifference: 0,
          points: 0
        });
      } else {
        let win = score2 > score1,
          lose = score2 < score1,
          draw = score2 === score1;

        store = store.map(item => {
          const {
            key,
            totalWins,
            totalDefeats,
            totalDraws,
            goalsFor,
            goalsAgainst
          } = item;

          if (key === team2.key) {
            return {
              ...item,
              totalWins: win ? totalWins + 1 : totalWins,
              totalDraws: draw ? totalDraws + 1 : totalDraws,
              totalDefeats: lose ? totalDefeats + 1 : totalDefeats,
              goalsFor: goalsFor + score2,
              goalsAgainst: goalsAgainst + score1
            };
          } else {
            return {
              ...item
            };
          }
        });
      }
    });
  });

  return store
    .map(item => {
      const { totalWins, totalDraws, goalsFor, goalsAgainst } = item;

      // TODO: Use enums
      const wins = totalWins * SCORE_VALUES.WIN,
        draws = totalDraws * SCORE_VALUES.DRAW;

      const points = wins + draws,
        goalDifference = goalsFor - goalsAgainst;

      // const rank = points + goalDifference + goalsFor;

      return {
        ...item,
        points,
        goalDifference
        // rank -> Work out here instead of below?
      };
    })
    .sort(
      // https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields
      // This will sort your array by "points" and if they are the same (ie. 3) then it
      // will sort by "goalDifference".
      // Rank is determined by points, then goal difference, then goals scored.
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor
    )
    .map((item, i) => ({
      ...item,
      rank: i + 1
    }));
};
