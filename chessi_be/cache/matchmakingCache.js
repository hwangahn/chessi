// missing some additional rules involving priorities


let matchMakingCache = (function() {
    let queue = new Array;
    // {userid: 1, rating: 1700, sideHistory: ["white", "white", "white", "white", "white"], priority: 0}

    let addUser = (user) => {
        queue.push(user);
    }

    // addUser({userid: 1, rating: 1700, sideHistory: ["white", "white", "white", "white", "white"], priority: 0})

    let filterUserByuserid = (userid) => {
        queue = queue.filter(Element => Element.userid !== userid);
    }

    let filterUserBysocketid = (socketid) => {
        queue = queue.filter(Element => Element.socketid !== socketid);
    }

    let normalizePlayer = (player) => {
         // normalize side history into number index for later matchmaking
        // this is based on how often they've played white or black within 5 matches
        if (player.sideIndex !== undefined) {
            return player;
        }

        let sideIndex = player.sideHistory.reduce((accumulator, currentValue) => {
            let index = currentValue === "white" ? 1 : -1; // white counts as 1, black counts as -1
            return accumulator + index;
        }, 0);

        return {userid: player.userid, socketid: player.socketid, rating: player.rating, sideIndex: sideIndex, priority: player.priority}
    }
    
    let distributePlayers = () => { // returning players in each pool based on play history
        let normalizedPlayers = queue.map(player => {
            return normalizePlayer(player);
        });

        let playerRemovedFromQueue = normalizedPlayers.filter(Element => { // remove player waited for more than 5 iteraton of match making algo
            return Element.priority > 5;
        })

        let neutral = normalizedPlayers.filter(Element => {
            return Element.priority <= 5 && ((Element.sideIndex > -3 && Element.sideIndex < 3) || Element.priority >= 4);
        }).sort((a, b) => a.rating - b.rating);

        let mustBeWhite = normalizedPlayers.filter(Element => {
            return Element.sideIndex <= -3 && Element.priority < 4;
        }).sort((a, b) => a.rating - b.rating);

        let mustBeBlack = normalizedPlayers.filter(Element => {
            return Element.sideIndex >= 3 && Element.priority < 4;
        }).sort((a, b) => a.rating - b.rating);

        return { neutral, mustBeWhite, mustBeBlack, playerRemovedFromQueue };
    }

    
    let matchMaking = () => { // match-making logic, merge-sort esque
        let { neutral, mustBeWhite, mustBeBlack, playerRemovedFromQueue } = distributePlayers();

        let matches = new Array();
        let waitingQueue = new Array();

        let i = 0, j = 0, ratingGap = 100;

        while (i < mustBeWhite.length && j < mustBeBlack.length) {
            // see if any black-white pair is within acceptable gap
            if (Math.abs(mustBeWhite[i].rating - mustBeBlack[j].rating) <= ratingGap) {
                matches.push({ white: mustBeWhite[i], black: mustBeBlack[j] });
                i++;
                j++;
            // if one is too low, we skip them, add into next queue
            } else if (mustBeWhite[i].rating < mustBeBlack[j].rating) {
                mustBeWhite[i].priority++;
                waitingQueue.push(mustBeWhite[i]);
                i++;
            } else {
                mustBeBlack[j].priority++;
                waitingQueue.push(mustBeBlack[j]);
                j++;
            }
        }

        // the rest that's left is pushed to next queue

        while (i < mustBeWhite.length) {
            mustBeWhite[i].priority++;
            waitingQueue.push(mustBeWhite[i]);
            i++;
        }

        while (j < mustBeBlack.length) {
            mustBeBlack[j].priority++;
            waitingQueue.push(mustBeBlack[j]);
            j++;
        }

        for (let k = 0; k < neutral.length; k++) {
            if (k + 1 < neutral.length && neutral[k + 1].rating - neutral[k].rating <= ratingGap) {
                matches.push(neutral[k + 1].sideIndex < neutral[k].sideIndex ? 
                                    { white: neutral[k + 1], black: neutral[k] } : 
                                    { white: neutral[k], black: neutral[k + 1] });
                k++;
            } else {
                neutral[k].priority++;
                waitingQueue.push(neutral[k]);
            }
        }

        queue = waitingQueue;

        console.log(queue);

        return { matches, playerRemovedFromQueue };
    }

    return { addUser, filterUserByuserid, filterUserBysocketid, matchMaking }
})();


module.exports = { matchMakingCache }