import { createContext, useState } from "react";

export const TournamentContentContext = createContext(null);

export function TournamentContent({ children }) {
	let [time, setTime] = useState(null);
    let [players, setPlayers] = useState([]);
    let [games, setGames] = useState([]);
    let [tournamentName, setTournamentName] = useState(null);
    let [tournamentStatus, setTournamentStatus] = useState(null);
    let [isInTournament, setIsInTournament] = useState(false);

  return (
    <TournamentContentContext.Provider value={{ time, setTime, players, setPlayers, games, setGames, tournamentName, setTournamentName, tournamentStatus, setTournamentStatus, isInTournament, setIsInTournament }}>
      {children}
    </TournamentContentContext.Provider>
  )
}