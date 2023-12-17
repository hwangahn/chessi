// starts internal caching

const { user } = require('../models/user');
const { game } = require('../models/game');
const { gameUser } = require('../models/gameUser');
const { ratingChange } = require('../models/ratingChange');
const { move } = require('../models/move');
const { socketInstance } = require('../socketInstance');
const { userOnlineCache } = require('./userOnlineCache');
const { matchMakingCache } = require('./matchmakingCache');
const { activeGameCache } = require('./activeGameCache');
const { activeRatingChange } = require('./ratingCache');
const { activeGame } = require('./gameCache');

setInterval(() => { // user online cache
    userOnlineCache.filterUserBySessionTime();
}, 1000)

setInterval(() => { // game cache
    let { gamesOver, gamesActive } = activeGameCache.filterGameOver();
    
    gamesOver.forEach(async Element => {
        socketInstance.get().to(Element.gameid).emit("game over", Element.reason); // notify room of game outcome

        let whiteRatingChange = 0;
        let blackRatingChange = 0;

        // calculate rating change
        if (Element.outcome === "not draw" && Element.winner === "white") {
            whiteRatingChange += Element.ratingChange;
            blackRatingChange -= Element.ratingChange;
        } else if (Element.outcome === "not draw" && Element.winner === "black") {
            whiteRatingChange -= Element.ratingChange;
            blackRatingChange += Element.ratingChange;
        }

        // create game in database
        await game.create({
            gameid: Element.gameid,
            reason: Element.reason,
            pgn: Element.game.pgn(),
            finalFen: Element.game.fen(),
        });

        // create gameuser
        await gameUser.bulkCreate([
            { gameid: Element.gameid, userid: Element.white.userid, side: "white", ratingChange: whiteRatingChange }, 
            { gameid: Element.gameid, userid: Element.black.userid, side: "black", ratingChange: blackRatingChange }
        ]);

        // normalize history into array of move records to be put into database
        let normalizedMoveArray = Element.game.history({ verbose: true }).map((insideElement, index) => {
            return { gameid: Element.gameid, moveOrder: index + 1, side: insideElement.color === "w"? "white" : "black", notation: insideElement.san, fen: insideElement.after }
        });

        // put moves to database
        await move.bulkCreate( normalizedMoveArray )

        // update rating in cache
        Element.white.rating += whiteRatingChange;
        Element.black.rating += blackRatingChange;

        // update rating in database
        await user.update({ rating: Element.white.rating }, {
            where: { userid: Element.white.userid }
        });

        await user.update({ rating: Element.black.rating }, {
            where: { userid: Element.black.userid }
        });
    });

    gamesActive.forEach(Element => {
        socketInstance.get().to(Element.gameid).emit("time left", Element.getTimeLeft().turn, Element.getTimeLeft().timeLeft); // notify room of time left
    });

}, 1000);

setInterval(() => { // match making cache
    let { games, playerRemovedFromQueue } = matchMakingCache.matchMaking();

    playerRemovedFromQueue.forEach(Element => {
        socketInstance.get().to(Element.socketid).emit("cannot find game"); // notify user of inability to find game
    });

    games.forEach((Element, index) => {

        let gameid = `${Date.now()}${index}`;
        activeGameCache.addGame(new activeGame(gameid, Element.white, Element.black));

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
    });

}, 5000);

setInterval(async () => { // rating change cache
    // normalize rating cache into ratingChange records
    let normalizedRatingChange = activeRatingChange.getRatingChangeAndClear().map(Element => {
        return { userid: Element.userid, rating: Element.rating }
    });

    // put rating change to database
    await ratingChange.bulkCreate( normalizedRatingChange );
}, 24 * 60 * 60 * 1000) // every day
// }, 2 * 60 * 1000) // every 2 minute