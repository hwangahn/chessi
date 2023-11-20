// missing some additional rules involving priorities


let matchMakingCache = (function() {
    let queue = new Array;
    // {userid: 1, elo: 1700, sideHistory: ["white", "white", "white", "white", "white"], priority: 0}

    let addUser = (user) => {
        queue.push(user);
    }

    addUser({userid: 1, elo: 1700, sideHistory: ["white", "white", "white", "white", "white"], priority: 0}) // 5
    addUser({userid: 2, elo: 1600, sideHistory: ["black", "black", "black", "black", "white"], priority: 0}) // -3
    addUser({userid: 3, elo: 1600, sideHistory: ["white", "white", "black", "black", "black"], priority: 0}) // -1
    addUser({userid: 4, elo: 1500, sideHistory: ["white", "white", "white", "white", "black"], priority: 0}) // 3
    addUser({userid: 5, elo: 1500, sideHistory: [], priority: 0})
    addUser({userid: 6, elo: 1500, sideHistory: [], priority: 0})
    addUser({userid: 7, elo: 1500, sideHistory: [], priority: 0})
    addUser({userid: 8, elo: 1500, sideHistory: [], priority: 0})
    addUser({userid: 9, elo: 1500, sideHistory: [], priority: 0})
    addUser({userid: 10, elo: 1500, sideHistory: [], priority: 0})

    let filterUserById = (userid) => {
        queue = queue.filter(Element => Element.userid !== userid);
    }
    
    let distributePlayers = () => { // returning players in each pool based on play history
        let normalizedPlayers = queue.map(Element => { // normalize side history into number index for later matchmaking
            // this is based on how often they've played white within 5 matches
            if (Element.sideIndex !== undefined) {
                return Element;
            }

            let sideIndex = Element.sideHistory.reduce((accumulator, currentValue) => {
                let index = currentValue === "white" ? 1 : -1; // white counts as 1, black counts as -1
                return accumulator + index;
            }, 0);

            return {userid: Element.userid, elo: Element.elo, sideIndex: sideIndex, priority: Element.priority}
        });

        let neutral = normalizedPlayers.filter(Element => {
            return (Element.sideIndex > -3 && Element.sideIndex < 3) || Element.priority >= 4;
        }).sort((a, b) => a.elo - b.elo);

        let mustBeWhite = normalizedPlayers.filter(Element => {
            return Element.sideIndex <= -3 && Element.priority < 4;
        }).sort((a, b) => a.elo - b.elo);

        let mustBeBlack = normalizedPlayers.filter(Element => {
            return Element.sideIndex >= 3 && Element.priority < 4;
        }).sort((a, b) => a.elo - b.elo);

        return { neutral, mustBeWhite, mustBeBlack };
    }

    
    let matchMaking = () => { // match-making logic, merge-sort esque
        let { neutral, mustBeWhite, mustBeBlack } = distributePlayers();

        let matches = new Array();
        let waitingQueue = new Array();

        let i = 0, j = 0, eloGap = 100;

        while (i < mustBeWhite.length && j < mustBeBlack.length) {
            // see if any black-white pair is within acceptable gap
            if (Math.abs(mustBeWhite[i].elo - mustBeBlack[j].elo) <= eloGap) {
                matches.push({ white: mustBeWhite[i], black: mustBeBlack[j] });
                i++;
                j++;
            // if one is too low, we skip them, add into next queue
            } else if (mustBeWhite[i].elo < mustBeBlack[j].elo) {
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
            if (mustBeWhite[i].priority <= 5) {
                waitingQueue.push(mustBeWhite[i]);
            }
            i++;
        }

        while (j < mustBeBlack.length) {
            mustBeBlack[j].priority++;
            if (mustBeBlack[j].priority <= 5) {
                waitingQueue.push(mustBeBlack[j]);
            }
            j++;
        }

        for (let k = 0; k < neutral.length; k++) {
            if (k + 1 < neutral.length && neutral[k + 1].elo - neutral[k].elo <= eloGap) {
                matches.push(neutral[k + 1].sideIndex < neutral[k].sideIndex ? 
                                    { white: neutral[k + 1], black: neutral[k] } : 
                                    { white: neutral[k], black: neutral[k + 1] });
                k++;
            } else {
                neutral[k].priority++;
                if (neutral[k].priority <= 5) {
                    waitingQueue.push(neutral[k]);
                }
            }
        }

        queue = waitingQueue;

        return matches;
    }

    return { addUser, filterUserById, matchMaking }
})();


module.exports = { matchMakingCache }