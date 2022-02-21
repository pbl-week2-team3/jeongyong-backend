const jwt = require("jsonwebtoken");
const errorMessage = require("../message");
const { jsonWebTokenKey } = require("../config/config.json");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer')
        return res.status(401).send({ success: "false", message: errorMessage.authError });

    try {
        const { nickname } = jwt.verify(tokenValue, jsonWebTokenKey);
        const findUser = await User.findAll({
            attributes: [ "nickname" ],
            where: {
                nickname
            },
            raw: true
        });
        
        res.locals.nickname = findUser[0]["nickname"];
        next();
    } catch (error) {
        return res.status(401).send({ success: "false", message: errorMessage.authError })
    }
};

module.exports = authMiddleware;

// module.exports = (req, res, next) => {
//     const { authorization } = req.headers;
//     const [tokenType, tokenValue] = authorization.split(' ');

//     if (tokenType !== 'Bearer')
//         return res.status(401).send({ success: "false", message: errorMessage.authError });

//     try {
//         const { nickname } = jwt.verify(tokenValue, jsonWebTokenKey);
//         const findUser = User.findAll({
//             attributes: [ "nickname" ],
//             where: {
//                 nickname
//             },
//             raw: true
//         });
        
        
//         User.findAll({ 
//             attributes: [ "nickname" ],
//             where: {
//                 nickname
//             },
//             raw: true
//             })
//             .then((result) => {
//             console.log("middle: ", result[0]["nickname"]);
//             res.locals.nickname = result;
//         });
//         next();
//     } catch (error) {
//         return res.status(401).send({ success: "false", message: errorMessage.authError })
//     }
// };