const { searchUserService, searchPostService } = require('../services/searchService');
const { checkHttpError } = require('../utils/checkError');

let handleSearch = async (req, res) => {
    try {
        let { keyword, type } = req.query;

        let data;

        if (type === "user") {
            data = await searchUserService(keyword);
        } else if (type === "post") {
            data = await searchPostService(keyword);
        }

        res.status(200).json({ status: "ok", result: data });
        
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

module.exports = { handleSearch }