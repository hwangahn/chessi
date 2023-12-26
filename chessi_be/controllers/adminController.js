const { getAllUserDataService, getAllAdminDataService, getAdminAccountService, deleteAdminAccountService, putAdminAccountService } = require('../services/adminService')
const { checkHttpError } = require('../utils/checkError');

let handleGetAllUserData = async (req, res) => {
    try {
        let data = await getAllUserDataService();

        res.status(200).json({status: "ok",msg: "done", data: data})
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleGetAdminAccount = async (req, res) => {
    try {
        let userid = req.body.data;

        let data = await getAdminAccountService(userid);

        res.status(200).json({status: "ok", data: data});
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handlePutAdminAccount = async (req, res) => {
    try {
        let { username, password, email } = req.body;

        await putAdminAccountService(username, password, email );

        res.status(200).json({ status: "ok", msg: "Admin account created"});
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleDeleteAdminAccount = async (req, res) => {
    try {
        let userid  = req.params.adminid;

        await deleteAdminAccountService(userid);

        res.status(200).json({ status: "ok", msg: "Done"})
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleGetAllAdminData = async (req,res) => {
    try {
        let data = await getAllAdminDataService();
        
        res.status(200).json({status: "ok",msg: "done", data:data})
    } catch(err) {
        console.log(err);
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}





let handleGetAllGameData = async (req, res) => {
    try {

        let data = await getAllGameDataService();

        res.status(200).json({status: "ok",msg: "done", data:data})
        
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error",msg: err.getMessage()})
        }
    }
}
module.exports = { handleDeleteAdminAccount, handleGetAdminAccount, handleGetAllGameData, handleGetAllUserData, handlePutAdminAccount, handleGetAllAdminData }