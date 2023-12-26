const express = require('express');
const {handleDeleteAdminAccount, handleGetAdminAccount, handleGetAllGameData, handleGetAllUserData, handlePutAdminAccount, handleGetAllAdminData } = require('../controllers/adminController')
const {verifyJWT, verifyAccessToken, verifyAdmin} = require('../middlewares/auth');

let router = express.Router();

router.put('/api/admin', verifyJWT, verifyAccessToken ,verifyAdmin, handlePutAdminAccount );
router.get('/api/admin/all-user',verifyJWT, verifyAccessToken ,verifyAdmin, handleGetAllUserData );
router.get('/api/admin/all-game',verifyJWT, verifyAccessToken ,verifyAdmin, handleGetAllGameData );
router.get('/api/admin/all-admin',verifyJWT, verifyAccessToken ,verifyAdmin, handleGetAllAdminData );

router.get('/api/admin/:adminid',verifyJWT, verifyAccessToken ,verifyAdmin, handleGetAdminAccount );
router.delete('/api/admin/:adminid',verifyJWT, verifyAccessToken ,verifyAdmin, handleDeleteAdminAccount );
//router.get('api/active-user',)

module.exports = router;