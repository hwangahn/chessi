const { user } = require('../models/user');
const { study } = require('../models/study');
const { httpError } = require('../error/httpError');


let getAllStudiesService = async function() {
    let studies = await study.findAll();

    return { studies };
}


let createStudyService = async function( userid, name, emoji, color ) {
    let usersFound = await user.findOne({ where: { userid: userid }}); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(404, "Cannot find user"));
    }

    let newStudy = await study.create({
        name,
        description: {},
        emoji,
        color,
        authorid: userid,
        editors: [userid],
    });

    console.log(`Study ${newStudy.id} created by ${userid}`);

    return { id: newStudy.id };
}


let editStudyService = async function( userid, id, title, description, emoji, color ) {
    let studyFound = await study.findOne({ where: { id: id }});

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    if (!studyFound.editors.includes(userid)) {
        throw (new httpError(403, "You cannot edit this study, as you are not an editor"));
    }

    await studyFound.edit({
        name: title,
        description,
        emoji,
        color
    });

    console.log(`Study ${studyFound.id} edited by ${userid}`);
}


let getStudyService = async function( id ) {
    let studyFound = await study.findOne({ where: { id: id }});

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    return studyFound;
}


let removeStudyService = async function( userid, id ) {
    let studyFound = await study.findOne({ where: { id: id }});

    if (!studyFound) {
        throw (new httpError(404, "Cannot find study"));
    }

    if (!studyFound.editors.includes(userid)) {
        throw (new httpError(403, "You cannot remove this study, as you are not an editor"));
    }

    await study.destroy({ where: { id: id }});

    console.log(`Study ${id} removed by ${userid}`);
}


module.exports = { 
    getAllStudiesService,
    createStudyService,
    editStudyService,
    getStudyService,
    removeStudyService
};