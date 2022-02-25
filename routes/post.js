const express = require("express");
const { User, Post, Like, sequelize } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const loggedinMiddleware = require("../middlewares/loggedin-middleware");
const message = require("../message");
const queryString = require("../query");
const router = express.Router();


// 게시글 목록 가져오기
router.get("/post", loggedinMiddleware, async (req, res) => {
    const { nickname } = res.locals;

    const query = queryString.postFindQuery(nickname);
    console.log(query);
    const [ post ] = await sequelize.query(query);

    return res.send({
        post,
    });
});

// 게시글 추가
router.post("/post", authMiddleware, async (req, res) => {
    const { contents, img_url, type } = req.body;
    const { nickname } = res.locals;

    if (!contents || !img_url || !type || contents.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });
    
    await Post.create({
        user_id: nickname,
        contents,
        img_url,
        type,
    });

    return res.status(201).send({ success: "true", messages: message.success });
});

// 게시글 조회
router.get("/post/:postId", loggedinMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const query = queryString.postFindOneQuery(nickname, postId);

    const [[post]] = await sequelize.query(query);
    return res.send(post);
});

// 게시글 수정
router.put("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { contents, img_url, type } = req.body;
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
        return res.status(400).send({ success: "false", messages: message.isNotExistPostError });

    if (findPost[0]["user_id"] !== nickname)
        return res.status(400).send({ success: "false", messages: message.isNotWriterError })

    await Post.update({
        contents,
        img_url,
        type
    }, {
        where: {
            id: postId,
        }
    });

    const query = queryString.postFindOneQuery(nickname, postId);
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
        return res.status(401).send({ success: "false", messages: message.isNotExistPostError });

    if (findPost[0]["user_id"] !== nickname)
        return res.status(400).send({ success: "false", messages: message.isNotWriterError })

    await Post.destroy({
        where: {
            id: postId
        }
    });

    return res.send({ success: "true", messages: message.success });
});


// 게시글 좋아요
router.post("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const findPost = await Post.findAll({
        raw: true,
        attributes: [ "id" ],
        where: { id: postId }
    });

    if (findPost.length === 0)
        return res.status(400).send({ success: "false", messages: message.isNotExistPostError });

    const findLike = await Like.findAll({
        raw: true,
        attributes: [ "user_id", "post_id" ],
        where: {
            user_id: nickname,
            post_id: postId,
        }
    });

    if (findLike.length !== 0)
        return res.status(400).send({ success: "false", messages: message.existLikeError })

    await Like.create({
        user_id: nickname,
        post_id: postId
    });

    return res.status(201).send({ success: "true", messages: message.success })
});


// 게시글 좋아요 취소
router.delete("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals;

    const findLike = await Post.findAll({
        raw: true,
        attributes: [ "id" ],
        where: { id: postId },
        include: [{
            model: Like,
            attributes: [ "user_id", "post_id" ],
            where: { user_id: nickname }
        }]
    });

    if (findLike.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotExistLikeError });

    await Like.destroy({
        where: {
            user_id: nickname,
            post_id: postId,
        }
    })

    return res.status(200).send({ success: "true", message: message.success })
});

module.exports = router;