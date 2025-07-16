let activeTournamentCache = (function() {
    let tournamentList = new Array;

    let addTournament = (tournament) => {
        tournamentList.push(tournament);
    }

    let findTournamentByid = (tournamentid) => {
        return tournamentList.find(t => t.tournamentid == tournamentid);
    }

    let findTournamentByOrganizer = (organizerid) => {
        return tournamentList.find(t => t.organizerid == organizerid);
    }

    let findTournamentByPlayer = (userid) => {
        return tournamentList.find(t => t.isPlayerInTournament(userid));
    }

    let checkUserInTournament = (userid) => { // check whether user is in an active tournament and return tournamentid
        for (let i = 0; i < tournamentList.length; i++) {
            if (tournamentList[i].isPlayerInTournament(userid)) {
                return { inTournament: true, tournamentid: tournamentList[i].tournamentid };
            }
        }
        return { inTournament: false, tournamentid: null };
    }

    let checkUserInTournamentGame = (userid) => { // check whether user is in an active tournament game and return gameid
        for (let i = 0; i < tournamentList.length; i++) {
            if (tournamentList[i].isPlayerInTournamentGame(userid)) {
                return { inTournamentGame: true, gameid: tournamentList[i].activeGames[0].gameid };
            }
        }
        return { inTournamentGame: false, gameid: null };
    }

    let removeTournament = (tournamentid) => {
        const index = tournamentList.findIndex(t => t.tournamentid == tournamentid);
        if (index !== -1) {
            return tournamentList.splice(index, 1)[0];
        }
        return null;
    }

    let filterTournamentOver = () => { // remove tournaments that is over 
        let tournamentsOver = new Array; 
        tournamentList = tournamentList.filter(Element => {
            let isOver = Element.isTournamentOver();

            if (isOver) {
                tournamentsOver.push(Element);
            }
            return !isOver;
        });

        return { tournamentsOver: tournamentsOver, tournamentsActive: tournamentList };
    }

    let getAllTournaments = () => {
        return tournamentList;
    }

    let getTournamentCount = () => {
        return tournamentList.length;
    }

    return { 
        addTournament, 
        findTournamentByid, 
        findTournamentByOrganizer,
        findTournamentByPlayer,
        removeTournament,
        getAllTournaments,
        getTournamentCount,
        filterTournamentOver,
        checkUserInTournament,
        checkUserInTournamentGame
    }
})();

module.exports = { activeTournamentCache };