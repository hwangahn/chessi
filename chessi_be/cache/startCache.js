// starts internal caching

const { userOnline } = require('./userOnlineCache');
const { matchMakingCache } = require('./matchmakingCache');

setInterval(userOnline.filterUserBySessionTime, 1000);

setInterval(matchMakingCache.matchMaking, 1000);
