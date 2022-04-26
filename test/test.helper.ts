import * as mongoose from 'mongoose';
import {newUser} from './helper/users';
import { INestApplication } from '@nestjs/common';
export class Helper {

    private app: INestApplication;

    constructor(app: INestApplication) {
        this.app = app;
    }

    public async clearDB() {
        // mongoose.connect("mongodb://127.0.0.1:27017/game-of-tests",function(){
        //     /* Drop the DB */
        //     mongoose.connection.db.dropDatabase();
        //     return;
        // });
    }


    public async createUser() {
        return newUser();
    }

    // public authHeaderForUser(user: User | Admin): string {
    //     const configService = new ConfigService();
    //     const jwtService = new JwtService({
    //         secret: configService.get<string>('JWT_SECRET_KEY'),
    //     });

    //     const authPayload = { id: user.id ,role: user.role.roleName};
    //     const authToken = jwtService.sign(authPayload);
    //     return `Bearer ${authToken}`;
    // }
}