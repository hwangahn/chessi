class activeUser {
    constructor(userid, username, socketid, rating, sideHistory) {
        this.userid = userid;
        this.username = username;
        this.socketid = socketid;
        this.rating = rating, 
        this.sideHistory = sideHistory;
        this.priority = 0;
        this.loginTime = Date.now();
        this.accessTokenLifetime = 24 * 60 * 60 * 1000;
    }

    getSideIndex() { // in matchmaking
        let sideIndex = this.sideHistory.reduce((accumulator, currentValue) => {
            let index = currentValue === "white" ? 1 : -1; // white counts as 1, black counts as -1
            return accumulator + index;
        }, 0);

        return sideIndex;
    }

    increasePriority() { // in matchmaking
        this.priority++;
    }

    resetPriority() { // in matchmaking
        this.priority = 0;
    }

    isWaitingTooLong() { // in matchmaking
        return this.priority < 5;
    }

    isStillInSession() {
        return Date.now() - this.loginTime <= this.accessTokenLifetime;
    }
}

module.exports = { activeUser };