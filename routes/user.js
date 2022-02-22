const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const { jsonWebTokenKey } = require("../config/config.json");
const registIsValid = require("../lib/registValidate");
const message = require("../message");
const crypto = require("crypto");
const cookieParser = require("cookie-parser")
const router = express.Router();

// 사용자 로그인
router.post("/login", async (req, res) => {
    const { id, password } = req.body;

    if (id.length === 0 || password.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    if (!registIsValid.emailIsValid.test(id))
        return res.status(400).send({ success: "false", messages: message.emailFormError });

    const findUser = await User.findAll({
        attributes: [ 'email', 'password', 'nickname' ],
        where: {
            email : id,
            password : crypto.createHash('sha256').update(password).digest('base64')
        },
        raw: true
    });

    if (findUser.length === 0)
        return res.status(401).send({ success: "false", messages: message.isNotRegistedError });

    const token = jwt.sign({ nickname: findUser[0]["nickname"] }, jsonWebTokenKey);
    res.cookie('token', 'Bearer ' + token, { maxAge: 1800000, httpOnly: true });
    return res.status(201).send({ success: "true", messages: "Login success" });
});

// 사용자 등록
router.post("/register", async (req, res) => {
    const { id, nickname, password, confirmPassword, profile_img_url } = req.body;
    
    if (id.length === 0 || confirmPassword.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    if (!registIsValid.nicknameIsValid(nickname))
        return res.status(400).send({ success: "false", messages: message.nicknameLengthError });

    if (!registIsValid.passwordIsValid(nickname, password, confirmPassword))
        return res.status(400).send({ success: "false", messages: message.passwordLengthError }); 

    if (!registIsValid.emailIsValid.test(id))
        return res.status(400).send({ success: "false", messages: message.emailFormError });

    const existUser = await User.findAll({
        attributes: [ "email", "nickname" ],
        where: {
            [Op.or]: [{ nickname }, { email: id }]
        },
        raw: true
    });

    if (existUser.length)
        return res.status(400).send({ success: "false", messages : message.isRegistedError });

    await User.create({ 
        email : id,
        nickname, 
        password : crypto.createHash('sha256').update(password).digest('base64'), 
        profile_img_url 
    });

    return res.status(201).send({ success: "true", messages: "회원가입은 토큰을 발급하지 않으니 프론트께서는 다시 로그인API를 호출해주세요" });
});

module.exports = router;