import { keyExists } from "../helpers/arrayHelpers";
import { createStore } from "redux";
import teamReducer from "../reducers/teamReducer";

import {
  addTeam,
  updateTeamScore,
  updateTeamPoints,
  updateTeamGoalDifference
} from "../actions/teamActions";

import {
  calculateScores,
  calculateGoalDifference,
  calculatePoints
} from "../calculation/functions";

import SCORE_VALUES from "../enums/scoreValues";

const teamStore = createStore(teamReducer);

export default roundData => {
  /* This relies on a particular data shape, and could cause issues if
  you suddenly decide to change the structure of the raw JSON.
  We first calculate the scores for each team. */
  roundData.forEach(({ matches }) => {
    matches.forEach(({ team1, team2, score1, score2 }) => {
      // We get the exact current state of the Redux store.
      const storeState = teamStore.getState();

      // Refer to 'calculation/functions' for this section.
      const team1ScoreData = calculateScores(score1, score2);
      const team2ScoreData = calculateScores(score2, score1);

      // Should a team not exist of the key 'n' in the redux store, we create it.
      if (!keyExists(storeState, team1.key)) {
        teamStore.dispatch(
          addTeam({
            key: team1.key,
            name: team1.name,
            code: team1.code
          })
        );
      }

      /* Since we can be sure we have the team added (if not already), we dispatch a set
      of score data so it can be incremented for this particular round. */
      teamStore.dispatch(
        updateTeamScore({
          key: team1.key,
          scoreData: team1ScoreData
        })
      );

      // Rinse and repeat for the second team.
      if (!keyExists(storeState, team2.key)) {
        teamStore.dispatch(
          addTeam({
            key: team2.key,
            name: team2.name,
            code: team2.code
          })
        );
      }

      teamStore.dispatch(
        updateTeamScore({
          key: team2.key,
          scoreData: team2ScoreData
        })
      );
    });
  });

  /* Now we have the scores for each team, we can run some last metrics to
  figure out the total points and goal differences. */
  teamStore.getState().forEach(team => {
    const { totalWins, totalDraws, goalsFor, goalsAgainst } = team;

    const wins = totalWins * SCORE_VALUES.WIN,
      draws = totalDraws * SCORE_VALUES.DRAW;

    const points = calculatePoints(wins, draws),
      goalDifference = calculateGoalDifference(goalsFor, goalsAgainst);

    teamStore.dispatch(updateTeamPoints({ key: team.key, points }));
    teamStore.dispatch(
      updateTeamGoalDifference({ key: team.key, goalDifference })
    );
  });

  /* Since this is more a one-shot example, we just return the state of the store
  after calculations have been performed. You might want to wrap the app within redux
  to monitor the stores updates adn perform additional logic / requests. */
  return teamStore.getState();
};
