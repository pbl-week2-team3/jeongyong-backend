const express = require("express");
const { Post, Like, sequelize } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const loggedinMiddleware = require("../middlewares/loggedin-middleware");
const message = require("../message");
const queryString = require("../query");
const router = express.Router();


// 게시글 목록 가져오기
router.get("/post", loggedinMiddleware, async (req, res) => {
    const { loggedin } = res.locals;
    let query;

    if ( loggedin ) {
        query = queryString.loggedinPostFind(res.locals.nickname);
    } else {
        query = queryString.notLoggedinPostFind();
    }
    
    console.query;
    const [ post ] = await sequelize.query(query);
    return res.send({
        post,
    });
});

// 게시글 추가
router.post("/post", authMiddleware, async (req, res) => {
    const { contents, img_url } = req.body;
    const { nickname } = res.locals;

    if (!contents || !img_url || contents.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });
    
    await Post.create({
        user_id: nickname,
        contents,
        img_url,
    });

    return res.status(201).send({ success: "true", messages: ""});
});

// 게시글 조회
router.get("/post/:postId", loggedinMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { loggedin } = res.locals;
    let query;

    if (loggedin) {
        query = queryString.loggedinPostFindOne(res.locals.nickname, postId);
    } else {
        query = queryString.notLoggedinPostFindOne(postId);
    }

    const [[post]] = await sequelize.query(query);
    return res.send(post);
});

// 게시글 수정
router.put("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { contents, img_url } = req.body;
    const { nickname } = res.locals;

    if (!contents || !img_url || contents.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    const findPost = await Post.findAll({
        attributes: [ "id", "user_id", "createdAt" ],
        raw: true,
        where: {
            id: postId,
        }
    });

    if (findPost.length === 0)
        return res.status(400).send({ success: "false", messages: message.isNotExistPost });

    if (findPost[0]["user_id"] !== nickname)
        return res.status(400).send({ success: "false", messages: message.isNotWriter })

    await Post.update({
        contents,
        img_url
    }, {
        where: {
            id: postId,
        }
    });

    const query = queryString.loggedinPostFindOne(nickname, postId);
    const [[post]] = await sequelize.query(query);
    return res.send(post);
});

// 게시글 삭제
router.delete("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const findPost = await Post.findAll({
        attributes: [ "id", "user_id" ],
        raw: true,
        where: {
            id: postId
        }
    });

    if (findPost.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotExistPost });

    if (findPost[0]["user_id"] !== nickname)
        return res.status(400).send({ success: "false", messages: message.isNotWriter })

    await Post.destroy({
        where: {
            id: postId
        }
    });

    // 사실 이 부분은 연계되어 삭제되도록 처리하는 방법이 있을 것 같다.
    await Like.destroy({
        where: {
            post_id: postId
        }
    })

    return res.send({ success: "true", messages: "" });
});


// 게시글 좋아요
router.post("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    // 이게 과연 옳은 쿼리인가
    const query = `SELECT IF (` + 
                ` EXISTS ( SELECT id FROM Posts WHERE id = ${postId}) AND` + 
                ` NOT EXISTS ( SELECT post_id, user_id FROM Likes WHERE post_id = ${postId} AND user_id = "${nickname}"), 1, 0) AS result;`;
    const [ find ] = await sequelize.query(query);
    
    if (find[0]['result'] === 0)
        return res.status(401).send({ success: "false", messages: "존재하지 않는 게시글이거나 좋아요 중복 요청입니다." });

    await Like.create({
        user_id: nickname,
        post_id: postId
    });

    return res.status(201).send({ success: "true", messages: ""})
});


// 게시글 좋아요 취소
router.delete("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const findPost = await Post.findAll({
        attributes: [ "id" ],
        raw: true,
        where: {
            id: postId
        }
    });

    if (findPost.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotExistPost });

    const findLike = await Like.findAll({
        raw: true,
        where: {
            user_id: nickname,
            post_id: postId,
        }
    });

    if (findLike.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotExistLike });

    await Like.destroy({
        where: {
            user_id: nickname,
            post_id: postId,
        }
    })

    return res.status(200).send({ success: "true", message: ""})
});

module.exports = router;