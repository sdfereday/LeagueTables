export default (state = [], action) => {
  if (typeof state === "undefined") {
    return [];
  }

  switch (action.type) {
    // Given that a team exists, we simply increment their score data.
    case "UPDATE_TEAM_SCORE":
      return state.map(team => {
        const { win, lose, draw, scoreFor, scoreAgainst } = action.scoreData;

        return team.key === action.key
          ? {
              ...team,
              totalWins: win ? team.totalWins + 1 : team.totalWins,
              totalDraws: draw ? team.totalDraws + 1 : team.totalDraws,
              totalDefeats: lose ? team.totalDefeats + 1 : team.totalDefeats,
              goalsFor: team.goalsFor + scoreFor,
              goalsAgainst: team.goalsAgainst + scoreAgainst
            }
          : team;
      });
    // Similar to above but more granular.
    case "UPDATE_TEAM_POINTS":
      return state.map(team => {
        return team.key === action.key
          ? {
              ...team,
              points: action.points
            }
          : team;
      });
    case "UPDATE_TEAM_GOAL_DIFFERENCE":
      return state.map(team => {
        return team.key === action.key
          ? {
              ...team,
              goalDifference: action.goalDifference
            }
          : team;
      });
    // Should the team not exist, we initialize it in to the store and set some base values.
    case "ADD_TEAM":
      return state.some(({ key }) => key === action.key)
        ? state
        : [
            ...state,
            {
              key: action.key,
              name: action.name,
              code: action.code,
              rank: 0,
              totalWins: 0,
              totalDraws: 0,
              totalDefeats: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              goalDifference: 0,
              points: 0
            }
          ];
    default:
      return state;
  }
};
