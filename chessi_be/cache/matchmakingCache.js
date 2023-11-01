// missing some additional rules involving priorities

// returning players in each pool based on play history
let distributePlayers = (players) => {
    let normalizedPlayers = players.map(Element => { // normalize side history into number index for later matchmaking
        // this is based on how often they've played white within 5 matches
        let sideIndex = Element.sideHistory.reduce((accumulator, currentValue) => {
            let index = currentValue === "white" ? 1 : -1; // white counts as 1, black counts as -1
            return accumulator + index;
        }, 0);

        return {userid: Element.userid, elo: Element.elo, sideHistory: Element.sideHistory, sideIndex: sideIndex, priority: Element.priority}
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

// this is the logic behind, merge-sort esque
let matchMaking = (players) => {
    let { neutral, mustBeWhite, mustBeBlack } = distributePlayers(players);

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
        waitingQueue.push(mustBeWhite[i]);
        i++;
    }

    while (j < mustBeBlack.length) {
        mustBeBlack[j].priority++;
        waitingQueue.push(mustBeBlack[j]);
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
            waitingQueue.push(neutral[k]);
        }
    }

    // console.log(waitingQueue);

    return { matches, waitingQueue };
}


module.exports = { matchMaking }
