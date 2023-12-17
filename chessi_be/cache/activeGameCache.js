let activeGameCache = (function() {
    let gameList = new Array;

    let addGame = (game) => {
        gameList.push(game);
    }

    let findGameBygameid = (gameid) => {
        return gameList.find(Element => Element.gameid === gameid);
    }

    let checkUserInGame = (userid) => { // check whether user is in an active game and return gameid
        for (let i = 0; i < gameList.length; i++) {
            if (gameList[i].isUserInGame(userid)) {
                return { inGame: true, gameid: gameList[i].gameid };
            }
        }
        return { inGame: false, gameid: null };
    }

    let filterGameOver = () => { // remove games that is over off active games
        let gamesOver = new Array; 
        gameList = gameList.filter(Element => {
            let isOver = Element.isGameOver();

            if (isOver) {
                gamesOver.push(Element);
            }
            return !isOver;
        });

        return {gamesOver: gamesOver, gamesActive: gameList};
    }

    return {addGame, findGameBygameid, checkUserInGame, filterGameOver }
})();

module.exports = { activeGameCache }