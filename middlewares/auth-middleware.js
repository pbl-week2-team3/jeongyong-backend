const jwt = require("jsonwebtoken");
const errorMessage = require("../message");
const { jsonWebTokenKey } = require("../config/config.json");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.cookies;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer')
        return res.status(401).send({ success: "false", message: errorMessage.authError });

    try {
        const { nickname } = jwt.verify(tokenValue, jsonWebTokenKey);
        const findUser = await User.findAll({
            attributes: [ "nickname", "profile_img_url" ],
            where: {
                nickname
            },
            raw: true
        });
        
        res.locals.nickname = findUser[0]["nickname"];
        res.locals.profile_img = findUser[0]["profile_img_url"];
        next();
    } catch (error) {
        return res.status(401).send({ success: "false", message: errorMessage.authError })
    }
};

module.exports = authMiddleware;