const jwt = require("jsonwebtoken");
const message = require("../message");
const { jsonWebTokenKey } = require("../config/config.json");
const { User } = require("../models");

const logedinMiddleware = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        res.locals.loggedin = false;
        return next();
    } 

    const [tokenType, tokenValue] = token.split(' ');

    if (tokenType !== 'Bearer') {
        res.locals.loggedin = false;
        return next();
    }

    try {
        const { nickname } = jwt.verify(tokenValue, jsonWebTokenKey);
        const findUser = await User.findAll({
            attributes: [ "nickname", "profile_img_url" ],
            where: {
                nickname
            },
            raw: true
        });

        if (findUser.length === 0) {
            res.locals.loggedin = false;
            return next();
        }
        
        res.locals.nickname = findUser[0]["nickname"];
        res.locals.profile_img = findUser[0]["profile_img_url"];
        res.locals.loggedin = true;
        return next();
    } catch (error) {
        res.locals.loggedin = false;
        return next();
    }
};

module.exports = logedinMiddleware;