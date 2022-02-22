const express = require("express");
const { Op, Sequelize } = require("sequelize");
const { Post, Like, User, sequelize } = require("../models");
// const { Comment } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const message = require("../message");
const router = express.Router();


// 게시글 목록 가져오기
router.get("/post", async (req, res) => {
    const result = await Post.findAll({raw: true});

    // 

    return res.send(result);
});

// 게시글 추가
router.post("/post", authMiddleware, async (req, res) => {
    const { contents, img_url } = req.body;
    const { nickname } = res.locals;

    if (contents.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });
    
    await Post.create({
        user_id: nickname,
        contents,
        img_url,
    });

    return res.status(201).send({ success: "true", messages: ""});
});

// 게시글 조회
router.get("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const findPost = await Post.findAll({
        raw: true,
        attributes: [ "id", ["user_id", "nickname"], "contents", "img_url", "createdAt" ],
        where: {
            id: postId,
        }
    });

    if (findPost.length === 0)
        return res.status(400).send({ success: "false", messages: message.isNotExistPost });

    const findUser = await User.findAll({
        raw: true,
        attributes: [ "profile_img_url" ],
        where: {
            nickname: findPost[0]["nickname"]
        }
    });

    if (findUser.length === 0)
        return res.status(400).send({ success: "false", messages: message.isNotRegistedError });

    const query = `SELECT COUNT(post_id) AS like_count,` + 
                    ` (SELECT COUNT(user_id) FROM likes WHERE post_id = ${postId} AND user_id = "${nickname}") AS like_check` +
                    ` FROM likes` + 
                    ` WHERE post_id = ${postId}`;

    const [ result ] = await sequelize.query(query);

    return res.send({
        id: findPost[0]["id"],
        nickname: findPost[0]["nickname"],
        contents: findPost[0]["contents"],
        img_url: findPost[0]["img_url"],
        createdAt: findPost[0]["createdAt"],
        profile_img: findUser[0]["profile_img_url"],
        like_count: result[0]["like_count"],
        like_check: result[0]["like_check"]
    });
});

// 게시글 수정
router.put("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { contents, img_url } = req.body;
    const { nickname } = res.locals;

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

    const findAfterUpdatePost = await Post.findAll({
        raw: true,
        attributes: [ "id", ["user_id", "nickname"], "contents", "img_url", "createdAt" ],
        where: {
            id: postId,
        }
    });

    const query = `SELECT COUNT(post_id) AS like_count,` + 
                    ` (SELECT COUNT(user_id) FROM likes WHERE post_id = ${postId} AND user_id = "${nickname}") AS like_check` +
                    ` FROM likes` + 
                    ` WHERE post_id = ${postId}`;

    const [ result ] = await sequelize.query(query);

    return res.send({
        id: findAfterUpdatePost[0]["id"],
        nickname: findAfterUpdatePost[0]["nickname"],
        contents: findAfterUpdatePost[0]["contents"],
        img_url: findAfterUpdatePost[0]["img_url"],
        createdAt: findAfterUpdatePost[0]["createdAt"],
        profile_img: res.locals.profile_img,
        like_count: result[0]["like_count"],
        like_check: result[0]["like_check"]
    });
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

    return res.send({ success: "true", messages: "" });
});


// 게시글 좋아요
router.post("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    // 이게 과연 옳은 쿼리인가
    const query = `SELECT IF ( EXISTS ( SELECT id FROM posts WHERE id = ${postId}) AND NOT EXISTS ( SELECT post_id, user_id FROM likes WHERE post_id = ${postId} AND user_id = "${nickname}"), 1, 0) AS result;`;
    const [ find ] = await sequelize.query(query);
    
    if (find[0]['result'] === 0)
        return res.status(401).send({ success: "false", messages: "존재하지 않는 게시글이거나 좋아요 중복 요청입니다." });

    // 뭐가 더 나은 방법일까
    /*
    const findPost = await Post.findAll({
        raw: true,
        where: {
            id: postId,
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

    if (findLike.length)
        return res.status(401).send({ success: "false", messages: message.duplicateLike });
    */

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