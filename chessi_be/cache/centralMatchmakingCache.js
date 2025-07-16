let matchMakingCache = (function() { // global matchmaking function
    let queue = new Array;

    let addUser = (user) => {
        queue.push(user);
    }

    let filterUserByuserid = (userid) => {
        queue = queue.filter(Element => Element.userid != userid);
    }

    let filterUserBysocketid = (socketid) => {
        let userFound = queue.find(Element => Element.socketid == socketid);
        if (userFound) {
            userFound.resetPriority(); // reset users match making priority
        }
        queue = queue.filter(Element => Element.socketid != socketid);
    }
    
    let distributePlayers = () => { // returning players in each pool based on play history
        let neutral = queue.filter(Element => {
            return Element.priority <= 5 && ((Element.getSideIndex() > -3 && Element.getSideIndex() < 3) || Element.priority >= 4);
        }).sort((a, b) => a.rating - b.rating);

        let mustBeWhite = queue.filter(Element => {
            return Element.getSideIndex() <= -3 && Element.priority < 4;
        }).sort((a, b) => a.rating - b.rating);

        let mustBeBlack = queue.filter(Element => {
            return Element.getSideIndex() >= 3 && Element.priority < 4;
        }).sort((a, b) => a.rating - b.rating);

        return { neutral, mustBeWhite, mustBeBlack };
    }

    
    let matchMaking = () => { // match-making logic, merge-sort esque
        let { neutral, mustBeWhite, mustBeBlack } = distributePlayers();

        let games = new Array();
        let newQueue = new Array();

        let i = 0, j = 0, ratingGap = 100;

        while (i < mustBeWhite.length && j < mustBeBlack.length) {
            // see if any black-white pair is within acceptable gap
            if (Math.abs(mustBeWhite[i].rating - mustBeBlack[j].rating) <= ratingGap) {
                // reset user's match making priority
                mustBeWhite[i].resetPriority();
                mustBeBlack[j].resetPriority();

                games.push({ white: mustBeWhite[i], black: mustBeBlack[j] });
                i++;
                j++;
            // if one is too low, we skip them, add into next queue
            } else if (mustBeWhite[i].rating < mustBeBlack[j].rating) {
                mustBeWhite[i].increasePriority();
                newQueue.push(mustBeWhite[i]);
                i++;
            } else {
                mustBeBlack[j].increasePriority();
                newQueue.push(mustBeBlack[j]);
                j++;
            }
        }

        // the rest that's left is pushed to next queue

        while (i < mustBeWhite.length) {
            mustBeWhite[i].increasePriority();
            newQueue.push(mustBeWhite[i]);
            i++;
        }

        while (j < mustBeBlack.length) {
            mustBeBlack[j].increasePriority();
            newQueue.push(mustBeBlack[j]);
            j++;
        }

        for (let k = 0; k < neutral.length; k++) {
            if (k + 1 < neutral.length && neutral[k + 1].rating - neutral[k].rating <= ratingGap) {
                // reset user's match making priority
                neutral[k].resetPriority();
                neutral[k + 1].resetPriority()

                games.push(neutral[k + 1].getSideIndex() < neutral[k].getSideIndex() ? 
                                    { white: neutral[k + 1], black: neutral[k] } : 
                                    { white: neutral[k], black: neutral[k + 1] });
                k++;
            } else {
                neutral[k].increasePriority();
                newQueue.push(neutral[k]);
            }
        }

        queue = newQueue;

        return { games };
    }

    return { addUser, filterUserByuserid, filterUserBysocketid, matchMaking }
})();


module.exports = { matchMakingCache }