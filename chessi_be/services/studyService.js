const { user } = require('../models/user');
const { study } = require('../models/study');
const { studyChapter } = require('../models/studyChapter');
const { httpError } = require('../error/httpError');
const { get } = require('../APIs/studyAPI');


let getAllStudiesService = async function () {
    let studies = await study.findAll({
        order: [["timestamp", "DESC"]], // newest first
        include: [{
            model: user,
        }]
    });

    studies = studies.map(study => {
        return {
            studyid: study.studyid,
            name: study.name,
            emoji: study.emoji,
            author: study.user.username,
            color: study.color,
            timestamp: study.timestamp
        };
    });

    return { studies };
}


let createStudyService = async function (userid, { name, emoji, color }) {
    let usersFound = await user.findOne({ where: { userid: userid } }); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(403, "Cannot create study"));
    }

    let newStudy = await study.create({
        name,
        emoji,
        color,
        authorid: userid,
        editors: [userid],
    });

    console.log(`Study ${newStudy.studyid} created by user ${userid}`);

    return { studyid: newStudy.studyid };
}


let editStudyService = async function (userid, { studyid, name, description, emoji, color }) {
    let usersFound = await user.findOne({ where: { userid: userid } }); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(403, "Cannot create study"));
    }

    let studyFound = await study.findOne({ where: { studyid: studyid } });

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    if (!studyFound.editors.includes(userid)) {
        throw (new httpError(403, "You cannot edit this study, as you are not an editor"));
    }

    await studyFound.update({
        name,
        description,
        emoji,
        color
    });

    console.log(`Study ${studyFound.studyid} edited by user ${userid}`);
}


let getStudyService = async function (studyid) {
    let studyFound = await study.findOne({
        where: { studyid: studyid },
        include: [
            {
                model: studyChapter,
                separate: true, // ensures ordering works properly
                order: [
                    ['internalOrder', 'ASC'], // first order by column internalOrder
                    ['timestamp', 'ASC'], // then order by column timestamp
                ]
            }
        ]
    });

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    studyFound = {
        studyid: studyFound.studyid,
        name: studyFound.name,
        description: studyFound.description,
        emoji: studyFound.emoji,
        color: studyFound.color,
        timestamp: studyFound.timestamp,
        chapters: studyFound.studyChapters.map(chapter => {
            return {
                chapterid: chapter.chapterid,
                name: chapter.name,
            };
        })
    };

    return studyFound;
}


let createChapterService = async function (userid, { studyid, name, fen }) {
    let usersFound = await user.findOne({ where: { userid: userid } }); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(403, "Cannot create chapter"));
    }

    let studyFound = await study.findOne({
        where: {
            studyid: studyid,
            authorid: userid
        }
    });

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    let newChapter = await studyChapter.create({
        name,
        fen,
        studyid: studyid,
        authorid: userid
    });

    console.log(`Chapter ${newChapter.chapterid} created in study ${studyid} by user ${userid}`);

    newChapter = {
        chapterid: newChapter.chapterid,
        name: newChapter.name
    };

    return { chapter: newChapter };
}


let getChapterService = async function (studyid, chapterid) {
    let chapterFound = await studyChapter.findOne({ where: { chapterid: chapterid, studyid: studyid } });

    if (!chapterFound) {
        throw (new httpError(404, "Cannot find chapter"));
    }

    return chapterFound;
}


let editChapterService = async function (userid, studyid, { chapterid, name }) {
    let usersFound = await user.findOne({ where: { userid: userid } }); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(403, "Cannot edit chapter"));
    }

    let chapterFound = await studyChapter.findOne({ where: { chapterid: chapterid, studyid: studyid } });

    if (!chapterFound) {
        throw (new httpError(404, "Cannot find chapter"));
    }

    if (chapterFound.authorid !== userid) {
        throw (new httpError(403, "You cannot edit this chapter, as you are not the author"));
    }

    await chapterFound.update({ name });

    console.log(`Chapter ${chapterid} edited in study ${studyid} by user ${userid}`);
}


let sortChapterService = async function (userid, studyid, chapters) {
    let usersFound = await user.findOne({ where: { userid: userid } }); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(403, "Cannot sort chapters"));
    }

    let studyFound = await study.findOne({ where: { studyid: studyid } });

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    await Promise.all(chapters.map(async (chapter, index) => {
        let chapterFound = await studyChapter.findOne({ where: { chapterid: chapter.chapterid, studyid: studyid } });

        if (!chapterFound) {
            throw (new httpError(404, "Cannot find chapter"));
        }

        await chapterFound.update({ internalOrder: index });
    }));

    console.log(`Chapters sorted in study ${studyid} by user ${userid}`);
}


let removeStudyService = async function (userid, studyid) {
    let studyFound = await study.findOne({ where: { studyid: studyid } });

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    if (!studyFound.editors.includes(userid)) {
        throw (new httpError(403, "You cannot remove this study, as you are not an editor"));
    }

    await study.destroy({ where: { studyid: studyid } });

    console.log(`Study ${studyid} removed by user ${userid}`);
};


module.exports = {
    getAllStudiesService,
    createStudyService,
    editStudyService,
    getStudyService,
    removeStudyService,

    createChapterService,
    getChapterService,
    editChapterService,
    sortChapterService
};