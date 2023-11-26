// starts internal caching

const { userOnlineCache } = require('./userOnlineCache');
const { matchMakingCache } = require('./matchmakingCache');
const { socketInstance } = require('../socketInstance');
const { activeGameCache } = require('./activeGameCache');
const { activeGame } = require('./gameCache');

setInterval(() => {
    userOnlineCache.filterUserBySessionTime();

    let gamesOver = activeGameCache.filterGameOver();
    
    gamesOver.forEach(Element => {
        socketInstance.get().to(Element.gameid).emit("game over", Element.reason);  
    });
}, 1000);

setInterval(() => {
    let { games, playerRemovedFromQueue } = matchMakingCache.matchMaking();

    playerRemovedFromQueue.forEach(Element => {
        Element.priority = 0; // reset player priority
        socketInstance.get().to(Element.socketid).emit("cannot find game"); // notify user of inability to find game
    });

    games.forEach((Element, index) => {
        let gameid = `${Date.now()}${index}`;
        activeGameCache.addGame(new activeGame(gameid, Element.white, Element.black));

        // notify user of game found and room id
        socketInstance.get().to(Element.white.socketid).emit("game found", gameid);
        socketInstance.get().to(Element.black.socketid).emit("game found", gameid);
    });

}, 1000);


