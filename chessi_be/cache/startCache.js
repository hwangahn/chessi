// starts internal caching

const { userOnline } = require('./userOnlineCache');

setInterval(userOnline.filterUserBySessionTime, 1000);
