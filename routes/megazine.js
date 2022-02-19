const express = require("express");
const { Op } = require("sequelize");
const { User } = require("../models");
const { Post } = require("../models");
const { Comment } = require("../models");
const router = express.Router();


// 게시글 목록 가져오기
router.get("/post", async (req, res) => {
    const result = await Post.findAll();
    return res.send(result);
});

// 게시글 추가
router.post("/post", async (req, res) => {
    const { contents, img_url } = req.body;

    // 토큰에서 아이디 파싱해서 넣어야 한다.
    await Post.create();

    return res.send({ result : "true" });
});

// 게시글 조회
// 댓글도 같이 가져와야 한다.
router.get("/post/:postId", async (req, res) => {
    const postId = req.params;

    const postFind = await Post.findAll({
        where: {
            id : postId
        },
    });

    if (postFind === null)
        return res.status(400).send({ result : "false", errorMessage: "존재하지 않는 게시글입니다." });

    const commentFind = await Comment.findAll({
        where: {
            post_id : postId,
        },
    });

    return res.json({
        posfFind,
        comments : commentFind
    });
});

// 게시글 수정
router.put("/post/:postId", (req, res) => {
    const postId = req.params;
    const { contents, img_url } = req.body;

    // JWT에서 아이디 가져와서 먼저 검사해보고 맞으면 update
    // const findPost = await Post.findAll({
    //     where: {
    //         id : postId,
    //         user_id : userId,
    //     }
    // });

    if (findPost.length)
        return res.status(400).send({ result: "false", errorMessage: "작성자가 아닙니다." });

    await Post.update({ contents, img_url }, {
        where: {
            id : postId,
        }
    });

    return res.send({ result: "true" });
});

// 게시글 삭제
router.delete("/post/:postId", (req, res) => {
    res.send("delete /post/:postId ok");
});

module.exports = router;