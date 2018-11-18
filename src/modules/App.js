import React from "react";
import compose from "recompact/compose";
import withState from "recompact/withState";
import withHandlers from "recompact/withHandlers";
import Textarea from "../components/textarea/Hoc";
import parseRoundData from "../calculation/rounds";

/* General HTML layout of this particular component. Since it's quite customized and
made from multiple parts, it felt more appropriate to name it a module.
You could split all of these out further in to even more components of course. */
const AppTemplate = ({
  tableName,
  rounds,
  inputData,
  exportedData,
  onGenerateTable,
  onDataExport
}) => {
  return (
    <div className="App">
      <h1>League Table</h1>
      <p>
        Note: The initial JSON has already been imported internally, you could
        of course acquire this via an API, copy/paste to textarea, etc.
      </p>
      <p>
        Clicking 'Generate Table' will convert the imported JSON to a league
        table and export it automatically below.
      </p>
      <div className="form">
        <button onClick={onGenerateTable}>Generate Table</button>
      </div>
      <div className="form">
        <Textarea
          id="output"
          placeholder="Output"
          value={exportedData}
          readOnly={true}
          disabled={!rounds}
        />
      </div>
      <h3 className="title">{tableName}</h3>
      {rounds && rounds.length && (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Wins</th>
              <th>Draws</th>
              <th>Defeats</th>
              <th>Goals For</th>
              <th>Goals Against</th>
              <th>Goals Difference</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map(
              (
                {
                  rank,
                  name,
                  totalWins,
                  totalDraws,
                  totalDefeats,
                  goalsFor,
                  goalsAgainst,
                  goalDifference,
                  points
                },
                i
              ) => {
                return (
                  <tr key={i}>
                    <td>{rank}</td>
                    <td>{name}</td>
                    <td>{totalWins}</td>
                    <td>{totalDraws}</td>
                    <td>{totalDefeats}</td>
                    <td>{goalsFor}</td>
                    <td>{goalsAgainst}</td>
                    <td>{goalDifference}</td>
                    <td>{points}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* We wrap the simple application component with higher order components to add a more
functional approach and avoid the need for classes. I believe a new feature proposal
of 'hooks' is being implented at some point to take care of this internally. */
export default compose(
  withState("tableName", "setTableName", ""),
  withState("rounds", "setRounds", null),
  withState("exportedData", "setExportedData", ""),
  withHandlers({
    onGenerateTable: ({
      inputData,
      setTableName,
      setRounds,
      setExportedData
    }) => e => {
      /* Another assumption made is that the data at this point has alread been parsed
      in to a JSON structure as expected. */
      const { name, rounds } = inputData;

      if (name) {
        setTableName(name);
      }

      if (rounds) {
        // ParseRoundData does the legwork here (see 'calculation' directory).
        const parsedRounds = parseRoundData(rounds);
        setRounds(parsedRounds);
        // Stringified to allow data to be formatted nicely and appear in a textarea for copying.
        setExportedData(
          parsedRounds ? JSON.stringify(parsedRounds, null, 2) : []
        );
      }
    }
  })
)(AppTemplate);
