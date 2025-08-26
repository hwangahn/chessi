// Import study services (to be implemented)
const {
    getAllStudiesService,
    createStudyService,
    getStudyService,
    editStudyService,
    removeStudyService,
    
    createChapterService,
    getChapterService,
    editChapterService,
    sortChapterService,
} = require('../services/studyService');
const { checkHttpError } = require('../utils/checkError');

let handleGetAllStudies = async (req, res) => {
    try {
        const { studies } = await getAllStudiesService();

        res.status(200).json({ status: "ok", studies });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleCreateStudy = async (req, res) => {
    try {
        const { userid } = req.token;
        const { name, emoji, color } = req.body;

        const { studyid } = await createStudyService(userid, { name, emoji, color });

        res.status(201).json({ status: "ok", studyid: studyid });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
};

let handleEditStudy = async (req, res) => {
    try {
        const { studyid } = req.params;
        const { userid } = req.token;
        const { title, description, color, emoji } = req.body;

        const study = await editStudyService(userid, { studyid, title, description, emoji, color });

        res.status(200).json({ status: "ok", study });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
};

let handleCreateChapter = async (req, res) => {
    try {
        const { studyid } = req.params;
        const { userid } = req.token;
        const { name, fen } = req.body;

        const { chapter } = await createChapterService(userid, { studyid, name, fen });

        res.status(201).json({ status: "ok", chapter });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
};

let handleGetChapter = async (req, res) => {
    try {
        const { studyid, chapterid } = req.params;

        const chapter = await getChapterService(studyid, chapterid);

        res.status(200).json({ status: "ok", chapter });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleEditChapter = async (req, res) => {
    try {
        const { studyid } = req.params;
        const { userid } = req.token;
        const { chapterid, name } = req.body;

        await editChapterService(userid, studyid, { chapterid, name });

        res.status(200).json({ status: "ok" });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleSortChapter = async (req, res) => {
    try {
        const { studyid } = req.params;
        const { userid } = req.token;
        const { chapters } = req.body;

        await sortChapterService(userid, studyid, chapters);

        res.status(200).json({ status: "ok" });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleRemoveStudy = async (req, res) => {
    try {
        const { studyid } = req.params;
        const { userid } = req.token;

        await removeStudyService(id, userid);

        res.status(200).json({ status: "ok" });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
};

let handleGetStudy = async (req, res) => {
    try {
        const { studyid } = req.params;
        const study = await getStudyService(studyid);
        res.status(200).json({ status: "ok", study });
    } catch (err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
};

module.exports = {
    handleGetAllStudies,

    handleCreateStudy,
    handleEditStudy,
    handleRemoveStudy,
    handleGetStudy,

    handleCreateChapter,
    handleGetChapter,
    handleEditChapter,
    handleSortChapter,
};