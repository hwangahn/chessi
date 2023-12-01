const { Chess } = require('chess.js');

class activeGame {
    constructor(gameid, whitePlayer, blackPlayer) {
        this.game = new Chess();
        this.gameid = gameid;
        this.black = blackPlayer;
        this.white = whitePlayer;
        this.timeLeft = 30;
        this.ratingChange = 7;
        this.outcome = ""; // outcome of the game. can be draw or not draw
        this.winner = ""; // the winner of the game. empty if draw
        this.over = false;
        this.reason = ""; // reason the game end
    }

    getTimeLeft() {
        return { turn: this.game.turn(), timeLeft: this.timeLeft };
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
            position: this.game.fen(),
            history: this.game.history({ verbose: true }),
            turn: this.game.turn(),
            timeLeft: this.timeLeft
        }
    }

    isTimeLeft() {
        if (this.timeLeft-- > 0) {
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
        return this.black.userid === userid || this.white.userid === userid;
    }

    makeMove(move) { // try making move
        try {
            if (!this.over) {
                let moveMade = this.game.move(move)
                this.timeLeft = 30;
                return moveMade; 
            }
        } catch(err) {
            console.log(err);
            return null; // null if illegal
        }
    }
} 

module.exports = { activeGame };