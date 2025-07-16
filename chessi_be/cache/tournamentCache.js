const { socketInstance } = require('../socketInstance');
const { matchMakingCache } = require('./matchmakingCache');
const { activeGame } = require('./gameCache');
const { activeGameCache } = require('./activeGameCache');
const { activeRatingChange } = require('./ratingCache');

class tournament {
    constructor(tournamentid, organizerid, name, gameTime = 60 * 5, tournamentTime = 30 * 60) {
        this.tournamentid = tournamentid;
        this.organizerid = organizerid;
        this.name = name;
        this.gameTime = gameTime; // time per player in seconds
        this.players = []; // array of player objects
        this.activeGames = []; // array of active game objects
        this.games = []; // array of game objects
        this.startTime = null;
        this.endTime = null;
        this.timeInterval;
        this.matchMakingInterval;
        this.tournamentTime = tournamentTime; // 30 minutes
        this.status = "not started"; // not started, started, ended

        this.matchMakingCache = new matchMakingCache(); // matchmaking cache for tournament
    }

    /**
     * @desc Match control for tournament
     */
    matchControl(){
        // Clear any existing interval
        if (this.matchInterval) {
            clearInterval(this.matchInterval);
        }

        this.matchInterval = setInterval(() => {
            let gamesOver = this.activeGames.filter(game => game.isGameOver());
            this.games.push(...gamesOver); // add games to tournament games

            this.activeGames = this.activeGames.filter(game => !game.isGameOver());
        }, 1000);
    }

    /**
     * @desc Start time control for tournament
     */
    timeControl(){
        // Clear any existing interval
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }

        // Emit initial tournament time
        socketInstance.get().to(this.tournamentid).emit("time left", this.formatSeconds(this.tournamentTime));

        this.timeInterval = setInterval(() => {
            // Decrease tournament time
            this.tournamentTime--;

            // Check if tournament time has run out but there are still active games
            if (this.tournamentTime >= 0) {
                // Emit updated tournament time to all players
                socketInstance.get().to(this.tournamentid).emit("time left", this.formatSeconds(this.tournamentTime));
            } else {
                this.endTournament();
                return;
            }
        }, 1000);
    }

    formatSeconds(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
      
        // Pad with leading zero if needed
        const paddedMins = String(mins).padStart(2, '0');
        const paddedSecs = String(secs).padStart(2, '0');
      
        return `${paddedMins}:${paddedSecs}`;
    }

    /**
     * @desc Add player to tournament. If player is already in tournament, return true. If tournament is ended, return false.
     * @param {object} player 
     * @returns {boolean}
     */
    addPlayer(player) {
        if (this.status == "ended") {
            return false;
        }

        if (this.players.find(p => p.userid === player.userid)) {
            return true;
        }
        
        this.players.push(player);
        
        // Notify all players about new registration
        socketInstance.get().to(this.tournamentid).emit('player joined', {
            userid: player.userid,
            username: player.username,
            rating: player.rating,
            points: 0,
            gamesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gameResults: [] // Array to store game results
        });

        return true;
    }

    /**
     * @desc Remove player from tournament. If player is not in tournament, return false
     * @param {string} userid 
     * @returns {boolean}
     */
    removePlayer(userid) {        
        const playerIndex = this.players.findIndex(p => p.userid === userid);

        if (playerIndex === -1) {
            return false
        }
        
        this.matchMakingCache.filterUserByuserid(userid); // remove user from match making queue
        const removedPlayer = this.players.splice(playerIndex, 1)[0];
        
        socketInstance.get().to(this.tournamentid).emit('player left', removedPlayer.userid);
        
        return true;
    }

    /**
     * @desc Start tournament
     * @returns 
     */
    startTournament() {         
        if (this.status !== "not started") {
            return false;
        }
        
        this.status = "started";

        socketInstance.get().to(this.tournamentid).emit('started');
        this.startTime = Date.now();

        this.timeControl(); // start time control for tournament
        this.matchMakingEngine(); // start tournament matchmaking engine
        this.matchControl(); // start tournament match control

        return true;
    }

    /**
     * @desc End further match making and time control
     * @returns {boolean}
     */
    endTournament(){
        if (this.status === "ended") {
            return false;
        }

        this.status = "ended";

        clearInterval(this.timeInterval)
        clearInterval(this.matchMakingInterval)

        this.matchMakingCache.clearQueue();
        this.endTime = Date.now();
        socketInstance.get().to(this.tournamentid).emit('ended');

        return true
    }


    /**
     * @desc Check if tournament is over and can be collected
     * @returns {boolean}
     */
    isTournamentOver(){
        return (this.tournamentTime <= 0 || this.status === "ended") && this.activeGames.length == 0;
    }

    userFindGame(userid){
        if (!this.isPlayerInTournament(userid) || this.tournamentTime <= 0){ // check if player is in tournament and tournament is not over
            return false;
        }

        let user = this.players.find(p => p.userid === userid);

        this.matchMakingCache.addUser(user);

        return true;
    }

    userStopFindGame(userid){
        if (!this.isPlayerInTournament(userid) || this.tournamentTime <= 0){ // check if player is in tournament and tournament is not over
            return false;
        }
        
        this.matchMakingCache.filterUserByuserid(userid); // remove user from match making queue

        return true;
    }

    /**
     * @desc Get user's active and completed games
     * @param {*} userid 
     * @returns 
     */
    getUserGames(userid){
        let activeGame = this.activeGames.find(game => game.isUserInGame(userid));
        let games = this.games.filter(game => game.isUserInGame(userid));

        if (activeGame) {
            let activeGameSide = activeGame.white.userid == userid ? "white" : "black";
            let activeGameOpponent = activeGame.white.userid == userid ? activeGame.black : activeGame.white;

            activeGame = {...activeGame.getGameInfo(), side: activeGameSide, opponent: activeGameOpponent};
        }

        games = games.map(game => {
            let side = game.white.userid == userid ? "white" : "black";
            let opponent = game.white.userid == userid ? game.black : game.white;
            let result = game.outcome == "draw" ? "d" : 
                        (game.winner == side ? "w" : "l");

            return {...game.getGameInfo(), opponent, result, side};
        });

        return { activeGame, games };
    }

    matchMakingEngine(){
        // Clear any existing matchmaking interval
        if (this.matchMakingInterval) {
            clearInterval(this.matchMakingInterval);
        }

        this.matchMakingInterval = setInterval(() => { // match making cache
            // Stop matchmaking if tournament time has expired
            if (this.tournamentTime <= 0) {
                clearInterval(this.matchMakingInterval);
                return;
            }

            let { games } = this.matchMakingCache.matchMaking();
        
            games.forEach((Element, index) => {
                let gameid = `${Date.now()}${index}`;

                // Create new active game and add to tournament's active games
                const newGame = new activeGame(gameid, Element.white, Element.black, 7, 7, this.gameTime);
                
                // Add to global active game cache
                activeGameCache.addGame(newGame);
                this.activeGames.push(newGame);
        
                // update side history in cache
                Element.white.sideHistory.push("white");
                Element.black.sideHistory.push("black");
        
                // notify user of game and room id
                socketInstance.get().to(Element.white.socketid).emit("game found", gameid);
                socketInstance.get().to(Element.black.socketid).emit("game found", gameid);
                
                // check if users already exist in rating change cache
                let isBlackInRatingCache = activeRatingChange.findUserByuserid(Element.black.userid);
                let isWhiteInRatingCache = activeRatingChange.findUserByuserid(Element.white.userid); 
        
                if (!isBlackInRatingCache) { // if not, add to cache
                    activeRatingChange.addUser(Element.black);
                };
        
                if (!isWhiteInRatingCache) { // if not, add to cache
                    activeRatingChange.addUser(Element.white);
                }
        
                console.log(`tournament ${this.tournamentid} game ${gameid} started with player ${Element.white.userid} and ${Element.black.userid}`);
            });
        
        }, 1000);
    }

    getStandings() {
        // Initialize standings object with all players having 0 points
        const standings = {};
        
        // Initialize all players with 0 points
        this.players.forEach(player => {
            standings[player.userid] = {
                userid: player.userid,
                username: player.username,
                rating: player.rating,
                points: 0,
                gameResults: [] // Array to store game results: 'w' for win, 'd' for draw, 'l' for loss
            };
        });

        // Calculate points from completed games
        this.games.forEach(game => {
            /**
             * @var game: games
             */
            if (game.over && game.white && game.black) {
                const whitePlayer = standings[game.white.userid];
                const blackPlayer = standings[game.black.userid];
                
                if (game.outcome === "draw") {
                    // Draw - both players get 0.5 points
                    if (whitePlayer) {
                        whitePlayer.points += 0.5;
                        whitePlayer.gameResults.push('d');
                    }
                    if (blackPlayer) {
                        blackPlayer.points += 0.5;
                        blackPlayer.gameResults.push('d');
                    }
                } else if (game.outcome === "not draw") {
                    // Not a draw - determine winner
                    if (game.winner === "white") {
                        if (whitePlayer) {
                            whitePlayer.points += 1;
                            whitePlayer.gameResults.push('w');
                        }
                        if (blackPlayer) {
                            blackPlayer.gameResults.push('l');
                        }
                    } else if (game.winner === "black") {
                        if (blackPlayer) {
                            blackPlayer.points += 1;
                            blackPlayer.gameResults.push('w');
                        }
                        if (whitePlayer) {
                            whitePlayer.gameResults.push('l');
                        }
                    }
                }                
            }
        });

        // Convert to array and sort by points (descending), then by rating (descending)
        const standingsArray = Object.values(standings).sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.rating - a.rating;
        });

        return standingsArray;
    }

    // Tournament Information
    getTournamentInfo() {
        return {
            tournamentid: this.tournamentid,
            organizerid: this.organizerid,
            name: this.name,
            startTime: this.startTime,
            players: this.getStandings(),
            status: this.startTime !== null ? "started" : "not started", // started or not started
            games: this.games
        };
    }

    // Utility Methods
    isPlayerInTournament(userid) {
        return this.players.some(p => p.userid == userid);
    }

    isPlayerInTournamentGame(userid) {
        return this.activeGames.some(game => game.isUserInGame(userid));
    }

    isOrganizer(userid) {
        return this.organizerid == userid;
    }
}

module.exports = { tournament };