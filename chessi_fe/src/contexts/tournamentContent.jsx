import { createContext, useState } from "react";

export const TournamentContentContext = createContext(null);

export function TournamentContent({ children }) {
  let [time, setTime] = useState(null);
  let [players, setPlayers] = useState([]);
  let [viewPlayer, setViewPlayer] = useState(null);
  let [games, setGames] = useState([]);
  let [playerGames, setPlayerGames] = useState(null);
  let [playerActiveGame, setPlayerActiveGame] = useState(null);
  let [tournamentName, setTournamentName] = useState(null);
  let [tournamentStatus, setTournamentStatus] = useState(null);
  let [isInTournament, setIsInTournament] = useState(false);

  return (
    <TournamentContentContext.Provider value={{ time, setTime, players, setPlayers, games, setGames, tournamentName, setTournamentName, tournamentStatus, setTournamentStatus, isInTournament, setIsInTournament, viewPlayer, setViewPlayer, playerGames, setPlayerGames, playerActiveGame, setPlayerActiveGame }}>
      {children}
    </TournamentContentContext.Provider>
  )
}