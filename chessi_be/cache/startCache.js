// starts internal caching

const { userOnline } = require('./userOnlineCache');
const { matchMaking } = require('./matchmakingCache');

let players = [
    {userid: 1, elo: 1700, sideHistory: ["white", "white", "white", "white", "white"], priority: 0}, // 5
    {userid: 2, elo: 1600, sideHistory: ["black", "black", "black", "black", "white"], priority: 0}, // -3
    {userid: 3, elo: 1600, sideHistory: ["white", "white", "black", "black", "black"], priority: 0}, // -1
    {userid: 4, elo: 1500, sideHistory: ["white", "white", "white", "white", "black"], priority: 0}, // 3
    {userid: 5, elo: 1500, sideHistory: [], priority: 0},
    {userid: 6, elo: 1500, sideHistory: [], priority: 0},
    {userid: 7, elo: 1500, sideHistory: [], priority: 0},
    {userid: 8, elo: 1500, sideHistory: [], priority: 0},
    {userid: 9, elo: 1500, sideHistory: [], priority: 0},
    {userid: 10, elo: 1500, sideHistory: [], priority: 0},
]

setInterval(userOnline.filterUserBySessionTime, 1000);

setInterval(() => {
    matchMaking(players)
}, 1000);
