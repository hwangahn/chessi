// Import study services (to be implemented)
const {
    getAllStudiesService,
    createStudyService,
    editStudyService,
    removeStudyService,
    getStudyService,
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

        const { studyid } = await createStudyService(name, emoji, color, userid);

        res.status(201).json({ status: "ok", id: studyid });
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
        const { id } = req.params;
        const { userid } = req.token;
        const { title, description, color, emoji } = req.body;

        const study = await editStudyService(userid, id, title, description, color, emoji);

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

let handleRemoveStudy = async (req, res) => {
    try {
        const { id } = req.params;
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
        const { id } = req.params;
        const study = await getStudyService(id);
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
    handleGetStudy
};