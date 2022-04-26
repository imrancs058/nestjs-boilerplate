import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';

import { ValidationPipe } from '@nestjs/common';


describe('Almuhasba auth test', () => {
    let app: INestApplication;
    let helper: Helper;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes( new ValidationPipe())
      
        await app.init();
        helper = new Helper(app);
    });

    it(`Should give error on  Register Test User with no payload `, async () => {
        let userTest = await helper.createUser();
        return request(app.getHttpServer())
            .post('/auth/register')
            .expect(400)
    });
    it(`Should give error on Register Test User with short firstName `, async () => {
        let userTest = await helper.createUser();
        userTest.firstName="da"
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userTest)
            .expect(400)
    });

    it(`Should give error on Register Test User with long firstName `, async () => {
        let userTest = await helper.createUser();
        userTest.firstName="I am testing it with dummy data"
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userTest)
            .expect(400)
    });

    it(`Should give error on Register Test User with short lastnametName `, async () => {
        let userTest = await helper.createUser();
        userTest.lastName="da"
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userTest)
            .expect(400)
    });

    it(`Should give error on Register Test User with long lastName `, async () => {
        let userTest = await helper.createUser();
        userTest.firstName="I am testing it with dummy data"
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userTest)
            .expect(400)
    });

    it(`Should Register Test User with valid payload `, async () => {
        let userTest = await helper.createUser();
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userTest)
            .expect(200)
    });

    afterAll(async () => {
        await helper.clearDB();
        await app.close();
    });
});