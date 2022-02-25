const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = 3000;
const app = express();


const { sequelize } = require('./models');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected.');
    }).catch((err) => {
        console.error(err);
    });

const userRouter = require("./routes/user");
const megazineRouter = require("./routes/post");
const commentRouter = require("./routes/comment");


const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};

app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.hidePoweredBy());
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);

app.use("/api", [userRouter, megazineRouter, commentRouter]);

app.get('/', (req, res) => {
    res.send('this is root page');
});

app.listen(port, () => {
    console.log("Express server listening on port :", port);
});

module.exports = app;