// cache for custom match lobby (e.g playing with a friend)

class activeLobby {
    constructor(creator, lobbyid) {
        this.creator = creator,
        this.guest = null,
        this.white = creator,
        this.black = null,
        this.lobbyid = lobbyid,
        this.timeLeft = 300,
        this.isStarted = false
    }

    addUser(userObj) {
        this.guest = userObj;
        if (this.black === null) {
            this.black = userObj
        } else {
            this.white = userObj
        }
    }

    isTimeout() {
        if (this.timeLeft-- > 0) {
            return true;
        } else {
            return false;
        } 
    }

    changeSide() {
        [ this.white, this.black ] = [ this.black, this.white ]
    }

    start() {
        this.isStarted = true;
    }

    isUserInLobby(userid) {
        return this.creator.userid === userid || this.guest.userid === userid;
    }
}

module.exports = { activeLobby }