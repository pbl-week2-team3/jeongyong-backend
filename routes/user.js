const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const { jsonWebTokenKey } = require("../config/config.json");
const registIsValid = require("../lib/registValidate");
const message = require("../message");
const crypto = require("crypto");
const authMiddleware = require("../middlewares/auth-middleware");
const loggedinMiddleware = require("../middlewares/loggedin-middleware");
const router = express.Router();

// 사용자 로그인
router.post("/login", loggedinMiddleware, async (req, res) => {
    const { id, password } = req.body;

    if (res.locals.nickname.length !== 0)
        return res.status(400).send({ success: "false", messages: message.loggedinError });

    if (!id || !password || id.length === 0 || password.length === 0)
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

    const newToken = jwt.sign({ nickname: findUser[0]["nickname"] }, jsonWebTokenKey);
    res.cookie('token', 'Bearer ' + newToken, { maxAge: 1800000, httpOnly: true });
    return res.status(201).send({ success: "true", messages: message.success, token: newToken});
});

// 사용자 등록
router.post("/register", loggedinMiddleware, async (req, res) => {
    const { id, nickname, password, confirmPassword } = req.body;
    let { profile_img_url } = req.body;
    
    if (res.locals.nickname.length !== 0)
    return res.status(400).send({ success: "false", messages: message.loggedinError });

    if (id.length === 0 || confirmPassword.length === 0)
        return res.status(400).send({ success: "false", messages: message.isEmptyError });

    if (!registIsValid.nicknameIsValid(nickname))
        return res.status(400).send({ success: "false", messages: message.nicknameLengthError });

    if (!registIsValid.passwordIsValid(nickname, password, confirmPassword))
        return res.status(400).send({ success: "false", messages: message.passwordLengthError }); 

    if (!registIsValid.emailIsValid.test(id))
        return res.status(400).send({ success: "false", messages: message.emailFormError });

    if (!profile_img_url || profile_img_url.length === 0)
        profile_img_url = "https://w.namu.la/s/69385ea0ef03c79c69fdaa27f2a9513361cc2e7b15fff89292f1e16c391e8a301a3525da697d9c062d407fa8b09d29a593a078af2862601e773b501826596cd1ad94d0ac73d9c61f99ae6050222137a3";

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

// 내 정보 조회
router.get('/me', authMiddleware, async (req, res) => {
    const { nickname, profile_img } = res.locals;
    return res.send({ 
        nickname, 
        profile_img 
    });
});


// 임시
router.get('/logout', authMiddleware, async (req, res) => {
    res.clearCookie('token');
    return res.send({messages: message.success});
});

module.exports = router;