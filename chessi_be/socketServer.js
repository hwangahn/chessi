let socketServerSingleton = (function() {
    let socketServerInstance = null;

    let set = (io) => {
        if (!socketServerInstance) {
            socketServerInstance = io;
        }
    };

    let get = () => {
        return socketServerInstance;
    }

    return { set, get }
})();

module.exports = { socketServerSingleton }