const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const { jsonWebTokenKey } = require("../config/config.json");
const emailIsValid = require("../lib/emailValidate");
const message = require("../message");
const router = express.Router();

// 사용자 로그인
router.post("/login", async (req, res) => {
    const { id, password } = req.body;

    if (id.length === 0 || password.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    if (!emailIsValid.test(id))
        return res.status(400).send({ success: "false", messages: message.emailFormError });

    const findUser = await User.findAll({
        attributes: [ 'email', 'password', 'nickname' ],
        where: {
            email : id,
            password
        },
        raw: true
    });

    if (findUser.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotRegistedError });

    const token = jwt.sign({ nickname: findUser[0]["nickname"] }, jsonWebTokenKey);
    return res.status(201).send({ success: "true", messages: "Login success", token: token });
});

// 사용자 등록
router.post("/register", async (req, res) => {
    const { id, nickname, password, confirmPassword, profile_img_url } = req.body;
    
    if (id.length === 0 || nickname.length === 0 || password.length === 0 || confirmPassword.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    if (!emailIsValid.test(id))
        return res.status(400).send({ success: "false", messages: message.emailFormError });

    if (password !== confirmPassword)
        return res.status(400).send({ success: "false", messages: message.confirmPasswordError });

    const existUser = await User.findAll({
        attributes: [ "email", "nickname" ],
        where: {
            [Op.or]: [{ nickname }, { email: id }]
        },
        raw: true
    });

    if (existUser.length)
        return res.status(400).send({ success: "false", messages : message.isRegistedError });

    // 사실 password는 단방향 해쉬값을 넣어야 한다. 이건 나중에..

    await User.create({ 
        email : id,
        nickname, 
        password, 
        profile_img_url 
    });

    return res.status(201).send({ success: "true", messages: "회원가입은 토큰을 발급하지 않으니 프론트께서는 다시 로그인API를 호출해주세요" });
});

module.exports = router;