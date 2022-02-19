const express = require("express");
const router = express.Router();


// 게시글 목록 가져오기
router.get("/post", (req, res) => {
    res.send("get /post ok");
});

// 게시글 추가
router.post("/post", (req, res) => {
    res.send("post /post ok");
});

// 게시글 조회
// 댓글도 같이 가져와야 한다.
router.get("/post/:postId", (req, res) => {
    res.send("get /post:postId ok");
});

// 게시글 수정
router.put("/post/:postId", (req, res) => {
    res.send("put /post/:postId ok");
});

// 게시글 삭제
router.delete("/post/:postId", (req, res) => {
    res.send("delete /post/:postId ok");
});

module.exports = router;