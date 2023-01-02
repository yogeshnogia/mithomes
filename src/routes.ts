import express from 'express';
import { userRouter } from './controllers/user/user.controller';

declare global{
    namespace Express {
        interface Request {
            user: {
                _id: string
            },
            token: string
        }
    }
}

export function routerConfig(app: express.Application) {


    app.use('/user', userRouter);

}

