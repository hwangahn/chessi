const express = require('express');
const router = express.Router();

const { handleGetAllStudies, handleCreateStudy, handleEditStudy, handleRemoveStudy, handleGetStudy, handleShareStudy } = require('../controllers/studyController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');

router.get('/studies/get', verifyJWT, verifyAccessToken, handleGetAllStudies);
router.post('/study/create', verifyJWT, verifyAccessToken, handleCreateStudy);
router.get('/study/:id/get', verifyJWT, verifyAccessToken, handleGetStudy);
router.post('/study/:id/edit', verifyJWT, verifyAccessToken, handleEditStudy);
router.delete('/study/:id/delete', verifyJWT, verifyAccessToken, handleRemoveStudy);
// router.post('/study/:id/share', verifyJWT, handleShareStudy);

module.exports = router;