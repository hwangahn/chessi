const { checkHttpError } = require('../utils/checkError');

let handlePostDiscussion = async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handlePostComment = async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleGetDiscussion = async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

module.exports = { handlePostDiscussion, handlePostComment, handleGetDiscussion }