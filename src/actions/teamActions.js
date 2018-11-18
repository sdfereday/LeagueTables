export const updateTeamScore = ({ key, scoreData }) => ({
  type: "UPDATE_TEAM_SCORE",
  key,
  scoreData
});

export const updateTeamGoalDifference = ({ key, goalDifference }) => ({
  type: "UPDATE_TEAM_GOAL_DIFFERENCE",
  key,
  goalDifference
});

export const updateTeamPoints = ({ key, points }) => ({
  type: "UPDATE_TEAM_POINTS",
  key,
  points
});

export const addTeam = ({ key, name, code }) => ({
  type: "ADD_TEAM",
  key,
  name,
  code
});
