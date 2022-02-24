const notLoggedinPostFind = () => {
    return  `SELECT p.id, p.user_id, p.contents, p.img_url, u.profile_img_url,` + 
            ` (SELECT COUNT(post_id) FROM Likes WHERE p.id = Likes.post_id) AS like_count,` + 
            ` (IF (EXISTS (SELECT user_id FROM Likes WHERE p.id = Likes.post_id AND Likes.user_id = ''), 1, 0)) AS like_check,` +
            ` p.createdAt` +
            ` FROM Posts AS p, Users AS u` + 
            ` WHERE p.user_id = u.nickname` + 
            ` ORDER BY p.createdAt DESC;`
}; 

const loggedinPostFind = (nickname) => {
    return  `SELECT p.id, p.user_id, p.contents, p.img_url, u.profile_img_url,` + 
            ` (SELECT COUNT(post_id) FROM Likes WHERE p.id = Likes.post_id) AS like_count,` + 
            ` (IF (EXISTS (SELECT user_id FROM Likes WHERE p.id = Likes.post_id AND Likes.user_id = '${nickname}'), 1, 0)) AS like_check,` +
            ` p.createdAt` +
            ` FROM Posts AS p, Users AS u` + 
            ` WHERE p.user_id = u.nickname;`
            ` ORDER BY p.createdAt DESC;`
};

const notLoggedinPostFindOne = (postId) => {
    return  `SELECT p.id, p.user_id, p.contents, p.img_url, u.profile_img_url,` + 
            ` (SELECT COUNT(post_id) FROM Likes WHERE p.id = Likes.post_id) AS like_count,` + 
            ` (IF (EXISTS (SELECT user_id FROM Likes WHERE p.id = Likes.post_id AND Likes.user_id = ''), true, false)) AS like_check,` +
            ` p.createdAt` +
            ` FROM Posts AS p, Users AS u` + 
            ` WHERE p.user_id = u.nickname AND p.id = ${postId};`
};

const loggedinPostFindOne = (nickname, postId) => {
    return  `SELECT p.id, p.user_id, p.contents, p.img_url, u.profile_img_url,` + 
            ` (SELECT COUNT(post_id) FROM Likes WHERE p.id = Likes.post_id) AS like_count,` + 
            ` (IF (EXISTS (SELECT user_id FROM Likes WHERE p.id = Likes.post_id AND Likes.user_id = '${nickname}'), true, false)) AS like_check,` +
            ` p.createdAt` +
            ` FROM Posts AS p, Users AS u` + 
            ` WHERE p.user_id = u.nickname AND p.id = ${postId};`
};

const notExitstLike = (nickname, postId) => {
    return  `SELECT IF (` + 
            ` EXISTS ( SELECT id FROM Posts WHERE id = ${postId}) AND` + 
            ` NOT EXISTS ( SELECT post_id, user_id FROM Likes WHERE post_id = ${postId} AND user_id = "${nickname}"), 1, 0) AS result;`
};

module.exports = {
    notLoggedinPostFind,
    loggedinPostFind,
    notLoggedinPostFindOne,
    loggedinPostFindOne,
    notExitstLike,
}