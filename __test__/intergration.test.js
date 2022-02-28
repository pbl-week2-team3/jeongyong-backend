const app = require('../app');
const { sequelize } = require('../models');
const request = require('supertest');

let token = "";

describe('API 통합 테스트 입니다.', () => {
    beforeAll(async () => {
        await sequelize.sync();
    });

    test('GET / 성공 시 Status Code 200', async () => {
        const res = await request(app)
        .get('/')
        .send();
        expect(res.status).toEqual(200);
    });

    test('POST /api/register 성공 시 Status Code 201', async() => {
        const res = await request(app)
            .post('/api/register')
            .send({
                id : "menistream@gmail.com",
                nickname : "XPECTER",
                password : "1111",
                confirmPassword : "1111",
                profile_img_url : ""
            });
        expect(res.status).toEqual(201);
        expect(res.body.success).toEqual("true");
    });

    test('POST /api/register 실패 시 Status Code 400', async() => {
        const res = await request(app)
            .post('/api/register')
            .send({
                id : "meni@gmail.com",
                nickname : "q1w2",
                password : "q1w2e3r4e",
                confirmPassword : "q1w2e3r",
                profile_img_url : ""
            });
        expect(res.status).toEqual(400);
        expect(res.body.success).toEqual("false");
    });

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

    test('GET /post 성공 시 Status Code 200', async() => {
        const res = await request(app)
            .get('/api/post')
            .send();

        expect(res.status).toEqual(200);
    });

    test('POST /post 성공 시 Status Code 201', async() => {
        const res = await request(app)
            .post('/api/post')
            .set('token', token)
            .send({
                contents: '123',
                img_url: '123',
                type: 3
            });

        expect(res.status).toEqual(201);
    });

    test('GET /post/1 성공 시 Status Code 200', async() => {
        const res = await request(app)
            .get('/api/post/1')
            .set('token', token)
            .send();

        expect(res.status).toEqual(200);
    });

    afterAll(async () => {
        await sequelize.drop();
        console.log("All tables droped.")
    });

    test('PUT /post/1 성공 시 Status Code 200', async() => {
        const res = await request(app)
            .put('/api/post/1')
            .set('token', token)
            .send({
                contents: '1234',
                img_url: '1234',
                type: 1
            });

        expect(res.status).toEqual(200);
        console.log(res.body.messages);
    });

    test('DELETE /post/1 성공 시 Status Code 200', async() => {
        const res = await request(app)
            .delete('/api/post/1')
            .set('token', token)
            .send();

        expect(res.status).toEqual(200);
        console.log(res.body.messages);
    });
});