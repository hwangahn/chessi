class activeGame {
    constructor(gameid, whitePlayer, blackPlayer) {
        this.gameid = gameid;
        this.black = blackPlayer;
        this.white = whitePlayer;
        this.turn = "white";
        this.timeLeft = 10;
        this.eloChange = 7;
        this.usersConnected = 2;
        this.over = false;
        this.reason = "";
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    getTurn() {
        return this.turn;
    }

    getBlack() {
        return this.black;
    }

    getWhite() {
        return this.white;
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
            turn: this.turn,
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
        if (!this.isTimeLeft()) {
            this.over = true;
            this.reason = `${this.turn} timed out`;
        }

        return this.over;
    }

    isUserInGame(userid) { // check whether user is in this game
        return this.black.userid === userid || this.white.userid === userid;
    }
} 

module.exports = { activeGame };