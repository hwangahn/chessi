let activeRatingChange = (function() {
    let ratingChangeList = new Array;

    let addUser = (user) => {
        ratingChangeList.push(user);
    };

    let findUserByuserid = (userid) => {
        return ratingChangeList.find(Element => Element.userid == userid);
    };

    let getRatingChangeAndClear = () => { // create a copy of current list and then clear the list
        let ratingChangeListClone = ratingChangeList
        ratingChangeList = [];
        return ratingChangeListClone;
    }

    return { addUser, findUserByuserid, getRatingChangeAndClear }
})()

module.exports = { activeRatingChange }