const express = require("express");
const router = express.Router();


// 게시글 조회에서 댓글까지 같이 보내준다.
// router.get("/comment/:postId", (req, res) => {
//     res.send("get /comment/:postId ok");
// });

// 댓글 추가
router.post("/comment/:postId", (req, res) => {
    res.send("post /comment/:postId ok");
});

// 댓글 수정
router.put("/comment/:postId/:commentId", (req, res) => {
    res.send("put /comment/:postId/:commentId ok");
});

// 댓글 삭제
router.delete("/comment/:postId/:commentId", (req, res) => {
    res.send("delete /comment/:postId/:commentId ok");
});

module.exports = router;