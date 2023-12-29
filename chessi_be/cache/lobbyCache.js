// cache for custom match lobby (e.g playing with a friend)

class activeLobby {
    constructor(lobbyid, creator) {
        this.creator = creator,
        this.guest = null,
        this.white = creator,
        this.black = null,
        this.lobbyid = lobbyid,
        this.timeLeft = 300,
        this.isStarted = false
    }

    addUser(userObj) {
        if (this.guest === null) {
            this.guest = userObj;

            if (this.black === null) {
                this.black = userObj
            } else {
                this.white = userObj
            }

            return true;
        } else if (this.creator === userObj || (this.guest && this.guest === userObj)) { // is user already in lobby
            return true;
        } else {
            return false;
        }
    }

    filterUserByuserid(userid) {
        if (this.creator.userid === userid) {
            if (this.guest === null) { // no one else in room
                this.timeLeft = 0; // timeout the room so it can be removed
            } else {
                // made guest lobby creator
                this.creator = this.guest; 
                this.guest = null;
            }
        } else if (this.guest?.userid === userid) {
            this.guest = null;
        }

        this.black?.userid === userid ? this.black = null : this.white = null;
    }

    filterUserBysocketid(socketid) {
        if (this.creator.socketid === socketid) {
            if (this.guest === null) { // no one else in room
                this.timeLeft = 0; // timeout the room so it can be removed
            } else {
                this.creator = this.guest; // make guest the new creator
            }
        } else if (this.guest?.socketid === socketid) {
            this.guest = null;
        }

        this.black?.socketid === socketid ? this.black = null : this.white = null;
    }

    getState() {
        return { 
            creator: this.creator, 
            guest: this.guest, 
            white: this.white,
            black: this.black,
            timeLeft: this.timeLeft
        };
    }

    getCreator() {
        return this.creator;
    }

    isTimeLeft() {
        if (this.timeLeft-- > 0) {
            return true;
        } else {
            return false;
        } 
    }

    switchSide() {
        [ this.white, this.black ] = [ this.black, this.white ]
    }

    start() {
        if (this.guest) { // has 2 players
            this.isStarted = true;
        }

        return this.isStarted;
    }

    isUserInLobbyByuserid(userid) {
        return this.creator.userid === userid || this.guest?.userid === userid;
    }

    isUserInLobbyBysocketid(socketid) {
        return this.creator.socketid === socketid || this.guest?.socketid === socketid;
    }
}

module.exports = { activeLobby }