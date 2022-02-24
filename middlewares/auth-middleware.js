const jwt = require("jsonwebtoken");
const message = require("../message");
const { jsonWebTokenKey } = require("../config/config.json");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    // const { token } = req.cookies;

    const token = req.headers.authorization;
    // console.log(token);
    
    if (!token)
        return res.status(401).send({ success: "false", messages: message.authError})

    const [tokenType, tokenValue] = token.split(' ');

    if (tokenType !== 'Bearer')
        return res.status(401).send({ success: "false", messages: message.authError });

    try {
        const { nickname } = jwt.verify(tokenValue, jsonWebTokenKey);
        const findUser = await User.findAll({
            attributes: [ "nickname", "profile_img_url" ],
            where: {
                nickname
            },
            raw: true
        });
        
        if (findUser.length === 0)
            return res.status(401).send({ success: "false", messages: message.authError })

        res.locals.nickname = findUser[0]["nickname"];
        res.locals.profile_img = findUser[0]["profile_img_url"];
        res.locals.loggedin = true;
        next();
    } catch (error) {
        return res.status(401).send({ success: "false", messages: message.authError })
    }
};

module.exports = authMiddleware;