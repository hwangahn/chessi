const { Chess } = require('chess.js');
const { socketInstance } = require('../socketInstance');

class activeGame {
    constructor(gameid, whitePlayer, blackPlayer, whiteRatingChange = 7, blackRatingChange = 7, time = 60 * 5) {
        this.game = new Chess();
        this.gameid = gameid;
        this.black = blackPlayer;
        this.white = whitePlayer;
        this.whiteTimeLeft = time;
        this.blackTimeLeft = time;
        this.ratingChange = whiteRatingChange;
        this.whiteRatingChange = whiteRatingChange; // TODO remove
        this.blackRatingChange = blackRatingChange;
        this.outcome = ""; // outcome of the game. can be draw or not draw
        this.winner = ""; // the winner of the game. empty if draw
        this.over = false;
        this.reason = ""; // reason the game end
        this.timeInterval;

        // Automatically start the time control when a new game is created
        this.timeControl();
    }

    formatSeconds(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
      
        // Pad with leading zero if needed
        const paddedMins = String(mins).padStart(2, '0');
        const paddedSecs = String(secs).padStart(2, '0');
      
        return `${paddedMins}:${paddedSecs}`;
      }

    timeControl(){
        clearInterval(this.timeInterval); // clear previous time interval

        socketInstance.get().to(this.gameid).emit("time left", this.game.turn(), this.formatSeconds(this.whiteTimeLeft), this.formatSeconds(this.blackTimeLeft));

        this.timeInterval = setInterval(() => {
            if (this.isGameOver()) { // check if game is over
                clearInterval(this.timeInterval);
                socketInstance.get().to(this.gameid).emit("game over", this.reason); // notify room of game outcome
                return;
            }

            if (this.game.turn() == 'w'){
                this.whiteTimeLeft--;
            } else{
                this.blackTimeLeft--;
            }

            socketInstance.get().to(this.gameid).emit("time left", this.game.turn(), this.formatSeconds(this.whiteTimeLeft), this.formatSeconds(this.blackTimeLeft));
        }, 1000);
    }

    getTimeLeft() {
        return { turn: this.game.turn(), whiteTimeLeft: this.formatSeconds(this.whiteTimeLeft), blackTimeLeft: this.formatSeconds(this.blackTimeLeft) };
    }

    getGameInfo() {
        return {
            gameid: this.gameid,
            black: {
                username: this.black.username,
                rating: this.black.rating,
            },
            white: {
                username: this.white.username,
                rating: this.white.rating,
            },
            outcome: this.outcome,
            winner: this.winner,
            position: this.game.fen(),
            history: this.game.history({ verbose: true }),
            turn: this.game.turn(),
            whiteTimeLeft: this.formatSeconds(this.whiteTimeLeft), 
            blackTimeLeft: this.formatSeconds(this.blackTimeLeft)
        }
    }

    isTimeLeft() {
        if (this.blackTimeLeft >= 0 && this.whiteTimeLeft >= 0) {
            return true;
        } else {
            return false;
        }
    }

    isGameOver() {
        if (!this.isTimeLeft()) { // check game timer
            this.over = true;
            this.reason = "Timed out";
            this.outcome = "not draw";
        } else if (this.game.isGameOver()) { // else check game state
            this.over = true;
            this.outcome = this.game.isCheckmate() ? "not draw" : "draw";
            this.reason = this.game.isCheckmate() ? "Checkmate" : this.reason;
            this.reason = this.game.isDraw() ? "50-move Rule" : this.reason;
            this.reason = this.game.isInsufficientMaterial() ? "Insufficient Material" : this.reason;
            this.reason = this.game.isStalemate() ? "Stalemate" : this.reason;
            this.reason = this.game.isThreefoldRepetition() ? "Threefold Repetition" : this.reason;
        }

        // update winner
        if (this.over) {
            if (this.outcome === "not draw") {
                this.winner = this.game.turn() === "w" ? "black" : "white";
            }
        }

        return this.over;
    }

    isUserInGame(userid) { // check whether user is in this game
        return this.black.userid == userid || this.white.userid == userid;
    }

    makeMove(move) { // try making move
        try {
            if (!this.over) {
                let moveMade = this.game.move(move)

                socketInstance.get().to(this.gameid).emit("move made", moveMade);
            }
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = { activeGame };