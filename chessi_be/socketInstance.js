let socketInstance = (function() {
    let io;

    let set = (newIo) => {
        io = newIo;
    }

    let get = () => {
        return io;
    }

    return { set, get }
})();

module.exports = { socketInstance }