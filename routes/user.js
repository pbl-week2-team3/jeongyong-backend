const express = require("express");
const { Op } = require("sequelize");
const { User } = require("../models");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (password.length === 0)
        return res.status(400).send({ result: "false", errorMessage: "비밀번호를 입력해주세요." });

    // email 형태 검사 넣기
    // if (email regex a@a.a)
    //  return res.status(400).send({ result: "false", errorMessage: "이메일 형식이 아닙니다." });

    const findUser = await User.findByPk(email);
    if (findUser === null)
        return res.status(400).send({ result: "false", errorMessage: "가입된 email정보가 없습니다." });

    if (findUser.password !== password)
        return res.status(400).send({ result: "false", errorMessage: "비밀번호가 틀렸습니다." });

    return res.status(200).send({ return: "true" });
});

router.post("/register", async (req, res) => {
    const { email, user_name, nickname, password, profile_img_url } = req.body;
    
    const existUser = await User.findAll({
        where: {
            [Op.or]: [{ nickname }, { email }],
        },
    });

    if (existUser.length)
        return res.status(400).send({ errorMessage : "이미 가입된 이메일 또는 닉네임이 있습니다." });

    await User.create({ email, user_name, nickname, password, profile_img_url });
    res.status(201).send({ result: "true" });
});

module.exports = router;