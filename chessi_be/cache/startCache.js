// starts internal caching

const { userOnline } = require('./userOnlineCache');
const { matchMakingCache } = require('./matchmakingCache');
const { socketInstance } = require('../socketInstance');

setInterval(userOnline.filterUserBySessionTime, 1000);

setInterval(() => {
    let { matches, playerRemovedFromQueue } = matchMakingCache.matchMaking();

    playerRemovedFromQueue.forEach(Element => {
        socketInstance.get().to(Element.socketid).emit("cannot find match"); // notify user of inability to find match
    });

    matches.forEach((Element, index) => {
        // notify user of match found and room id
        socketInstance.get().to(Element.white.socketid).emit("match found", `${Date.now()}${index}`);
        socketInstance.get().to(Element.black.socketid).emit("match found", `${Date.now()}${index}`);
    });
}, 5000);
