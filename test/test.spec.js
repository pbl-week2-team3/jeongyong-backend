const app = require('../app');
const { User, Post, Like, sequelize } = require('../models');
const request = require('supertest');

let token = "";

beforeAll(async () => {
    sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected.');
    }).catch((err) => {
        console.error(err);
    });
});

test('GET / 성공 시 Status Code 200', async() => {
    const res = await request(app)
        .get('/');
    expect(res.status).toEqual(200);
});

test('GET /api/post 성공 시 Status Code 200', async() => {
    const res = await request(app)
        .get('/api/post');
    expect(res.status).toEqual(200);
});

// test('POST /api/register 성공 시 Status Code 201', async() => {
//     const res = await request(app)
//         .post('/api/register')
//         .send({
//             id : "menistream@gmail.com",
//             nickname : "XPECTER",
//             password : "1111",
//             confirmPassword : "1111",
//             profile_img_url : ""
//         });
//     expect(res.status).toEqual(201);
//     expect(res.body.success).toEqual("true");
// });

test('POST /api/login 성공 시 Status Code 201', async() => {
    const res = await request(app)
        .post('/api/login')
        .send({
            id : "menistream@gmail.com",
            password : "1111"
        });
    expect(res.status).toEqual(201);
    expect(res.body.success).toEqual("true");
    token = res.body.token;
});

test('POST /api/register 토큰이 있는데 중복 로그인 요청 Status Code 400', async() => {
    const res = await request(app)
        .post('/api/register')
        .set('token', token)
        .send({
            id : "menistream@gmail.com",
            nickname : "XPECTER",
            password : "1111",
            confirmPassword : "1111",
            profile_img_url : ""
        });
    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual("false");
});

test('POST /api/login 토큰이 있는데 중복 로그인 요청 Status Code 400', async() => {
    const res = await request(app)
        .post('/api/login')
        .set('token', token)
        .send({
            id : "menistream@gmail.com",
            password : "1111"
        });
    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual("false");
});

// afterAll(async () => {
//     await sequelize.drop();
//     console.log("All tables droped.")
// });