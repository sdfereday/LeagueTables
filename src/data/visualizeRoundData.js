/* Perform some sorting on the items and assign a ranking value for the table to
export with. */
export default data =>
  data
    /*Rank is determined by points, then goal difference, then goals scored.
    If value equal, then the next condition is used. */
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor
    )
    // Assign a rank to reflect the index of the item now it's been sorted.
    .map((item, i) => ({
      ...item,
      rank: i + 1
    }));
