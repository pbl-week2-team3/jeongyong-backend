const jwt = require("jsonwebtoken");
const message = require("../message");
const { jsonWebTokenKey } = require("../config/config.json");
const { User } = require("../models");

const logedinMiddleware = async (req, res, next) => {
    // const { token } = req.cookies;
    const { token } = req.headers;

    if (!token) {
        res.locals.nickname = "";
        return next();
    } 

    try {
        const { nickname } = jwt.verify(token, jsonWebTokenKey);
        const findUser = await User.findAll({
            attributes: [ "nickname", "profile_img_url" ],
            where: {
                nickname
            },
            raw: true
        });

        if (findUser.length === 0) {
            res.locals.nickname = "";
            return next();
        }
        
        res.locals.nickname = findUser[0]["nickname"];
        res.locals.profile_img = findUser[0]["profile_img_url"];
        return next();
    } catch (error) {
        res.locals.nickname = "";
        return next();
    }
};

module.exports = logedinMiddleware;