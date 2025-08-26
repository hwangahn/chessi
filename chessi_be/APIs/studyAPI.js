const express = require('express');
const {
    handleGetAllStudies, 
    handleCreateStudy, 
    handleEditStudy, 
    handleRemoveStudy, 
    handleGetStudy,

    handleCreateChapter, 
    handleGetChapter,
    handleEditChapter, 
    handleSortChapter, 
} = require('../controllers/studyController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');

let router = express.Router();

router.get('/api/study/get-all', verifyJWT, verifyAccessToken, handleGetAllStudies);
router.post('/api/study/create', verifyJWT, verifyAccessToken, handleCreateStudy);
router.get('/api/study/:studyid/get', verifyJWT, verifyAccessToken, handleGetStudy);
router.post('/api/study/:studyid/edit', verifyJWT, verifyAccessToken, handleEditStudy);

router.post('/api/study/:studyid/chapter/create', verifyJWT, verifyAccessToken, handleCreateChapter);
router.get('/api/study/:studyid/chapter/:chapterid/get', verifyJWT, verifyAccessToken, handleGetChapter);
router.post('/api/study/:studyid/chapter/:chapterid/edit', verifyJWT, verifyAccessToken, handleEditChapter);
router.post('/api/study/:studyid/chapter/sort', verifyJWT, verifyAccessToken, handleSortChapter);
router.delete('/api/study/:studyid/delete', verifyJWT, verifyAccessToken, handleRemoveStudy);

module.exports = router;