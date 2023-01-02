import { Router } from 'express';
import { User } from '../../models/user.model';
import mongoose from 'mongoose';

import { userAuthenticate } from '../../middlewares/userAuthenticate.middleware'
import { checkPassword, decodeForgotPasswordToken, encryptPassword, generateForgotPasswordToken, generateToken, generateUserVerificationToken, logoutUser, sendForgotPasswordLink, sendVerficationLink, _checkIfEmailExists } from './user-helper';

import moment from 'moment';






export const userRouter = Router();


userRouter.get('/user-profile/:userId', userAuthenticate, async (req, res) => {
    const userId = req.user._id;
    try {
        let user: any = await User.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(userId) }
            },
            
            {
                $project: {
                    _id: 1,
                    "IsVerified": 1,
                    "preferredLanguage": 1,
                    "name": 1,
                    "email": 1,
                    "countryCode":1,
                    "username": 1,
                    "reference": 1,
                    "referredUsers": 1
                }
            }

        ])
        delete user.password;
        delete user.verificationToken;
        delete user.VerificationDate;

        res.send(user).status(200)
    } catch (err) {
        res.send({ err: "User not found" }).status(404)
    }

})

userRouter.post('/register', async (req: any, res) => {
    const userInput = req.body.user;
    const hostname = req.hostname;
    const deviceInfo = req.body.deviceInfo;
    let user: any = await _checkIfEmailExists(userInput.email);
    if (!user) {
        try {
            if (!userInput.password) {
                throw 'Password Required';
            }
            userInput.password = await encryptPassword(userInput.password).catch(err => res.send(err));
            userInput.createdDate = moment().utc()
            // const randomId = nanoid(30);
            // userInput.verificationToken = randomId;
            const user: any = await User.create(userInput);
            let resUser = user.toJSON();
            delete resUser.password;
            delete resUser.verificationToken;
            delete resUser.refernceIdUsed;
            const token = await generateToken(user, req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress, deviceInfo);

            const userVerificationToken = await generateUserVerificationToken(resUser._id.toString());
            await user.updateOne({verificationToken: userVerificationToken}).exec()
            sendVerficationLink(resUser._id.toString(), resUser.email, userVerificationToken);
         
            res.json({ status: true}).status(200)
        } catch (e) {
            res.send({ err: e, status: false }).status(503);
        }

    } else {
        if(!user.toJSON().IsVerified) {
            let resUser = user.toJSON();
            delete resUser.password;
            delete resUser.verificationToken;
            delete resUser.refernceIdUsed;
            sendVerficationLink(resUser._id.toString(), resUser.email, user.verificationToken);
            res.json({ status: true}).status(200)
        } else {
            res.send({ err: 'Email Id Already Present', status: false }).status(401);
        }
    }
})

userRouter.get('/resendVerificationLink/:emailId', async (req, res) => {
    try {
        const emailId = req.params.emailId;
        const user: any = await User.findOne({ email: emailId }).catch(err => { throw err });
        if (!user) {
            throw `No Email with ${emailId} found. Please register`;
        }
        const verificationToken = user.verificationToken;
        const userId = user._id;
        const userEmail = user.email;
        await sendVerficationLink(userId, userEmail, verificationToken).catch(err => { throw err });
        res.json({ status: true }).status(200)
    } catch (error) {
        res.json({ error, status: false }).status(503)
    }
})

userRouter.get('/verify-account-plain-html', async (req, res) => {
    // res.render('email-verify-success-plain');
    res.render('email-verify-failed-plain', {errorMessage: "Token invalid or expired!"});

})
userRouter.get('/verify-account/:userId/:verificationToken', async (req, res) => {
    try {
        const userId = req.params.userId;
        const verify = req.params.verificationToken;
        const user: any = await User.findById(userId);
        if (user.verificationToken === verify && (!user.IsVerified)) {
            user.IsVerified = true;
            user.VerificationDate = new Date();
            await User.findByIdAndUpdate(userId, user);
            const userObjId = user._id.toString();
            const refernceIdUsed = user.refernceIdUsed ?  user.refernceIdUsed.toString() : null;
            const token = verify;

            
            const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-success`
            res.render('email-verify-success-plain');
            // res.send({status: true}).status(200)
        } else {
            if(user.verificationToken !== verify) {
                throw 'InvalidToken'
            } else {
                throw 'AlreadyVerified'
            }
        }
    } catch (err) {
        // const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-failed?err=${err}`
        if(err === "InvalidToken") {
            res.render('email-verify-failed-plain', {errorMessage: "Token invalid or expired!"});
        }
        else if(err === "AlreadyVerified") {
            res.render('email-verify-failed-plain', {errorMessage: "User Already Verified!"});
        }
        else {
            res.render('email-verify-failed-plain', {errorMessage: "Email Verification Failed"});
        }

    }
})
userRouter.get('/verify-account-email/:userId/:verificationToken', async (req, res) => {
    try {
        const userId = req.params.userId;
        const verify = req.params.verificationToken;
        const user: any = await User.findById(userId);
        if (user.verificationToken === verify && (!user.IsVerified)) {
            user.IsVerified = true;
            user.VerificationDate = new Date();
            await User.findByIdAndUpdate(userId, user);
            const userObjId = user._id.toString();
            const refernceIdUsed = user.refernceIdUsed ?  user.refernceIdUsed.toString() : null;
            const token = verify;

           
            const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-success`
            res.render('email-verify-success-plain');
            // res.send({status: true}).status(200)
        } else {
            if(user.verificationToken !== verify) {
                throw 'Invalid Verification Token'
            } else {
                throw 'User Already Verified'
            }
        }
    } catch (err) {
        // const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-failed?err=${err}`
        res.render('email-verify-failed-plain', {errorMessage: err});
    }
})

userRouter.post('/login', async (req: any, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const deviceInfo = req.body.deviceInfo;


    User.findOne({
        email: userEmail,
    }, async (err: any, user: any) => {
        if (err) res.send({ err: 'Email Id not found', status: false }).status(503);
        else if (user && user.IsVerified === false) res.send({ err: 'Please Verify your Email Address. ',isVerifiedEmailErr: true, status: false }).status(503);
        else if (user && await checkPassword(userPassword, user.get('password'))) {
            const token = await generateToken(user, req.clientIp, deviceInfo);
            let resUser = user.toJSON();
            delete resUser.password;
            delete resUser.verificationToken;
            delete resUser.refernceIdUsed;

            res.json({ token, user: resUser }).status(200)
        } else {
            res.send({ err: 'Email Id or Password incorrect', status: false }).status(401)
        }
    })

});

userRouter.post('/logout', userAuthenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const tokenString = req.token;
        await logoutUser(userId, tokenString);
        res.json({ status: true }).status(200)
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})

userRouter.post('/updatePassword', userAuthenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;

        const userObj = await User.findById(userId).catch(err => { throw (err) });
        if (userObj && await checkPassword(oldPassword, userObj.get('password'))) {
            let password = await encryptPassword(newPassword).catch(err => { throw (err) });
            await User.findOneAndUpdate({ _id: userId }, { password: password })
        } else {
            res.send({ err: "Invalid Password", status: false }).status(503)
        }

        res.json({ status: true }).status(200)
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})
userRouter.post('/forgotPassword', async (req, res) => {
    try {
        const email = req.body.email;
        const deviceInfo = req.body.deviceInfo;

        const user: any = await User.findOne({ email: email }).catch(err => { throw (err) });
        if (user) {
            const userId = user._id.toString();
            const tokenString = await generateForgotPasswordToken(userId,req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress, deviceInfo );
            await sendForgotPasswordLink(userId, email, tokenString)
            res.json({ status: true }).status(200)
        } else {
            throw 'Email Not Found';
        }
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})
userRouter.post('/resetPassword', async (req, res) => {
    try {
        const newPassword = req.body.password;
        const tokenString = req.body.tokenString;
        const userId = await decodeForgotPasswordToken(tokenString);
        let password = await encryptPassword(newPassword).catch(err => { throw (err) });
        await User.findOneAndUpdate({ _id: userId }, { password: password });
        res.json({ status: true }).status(200)
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})


userRouter.put('/update-user', userAuthenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const name = req.body.name;
        const countryCode = req.body.countryCode;
        await User.findByIdAndUpdate(userId, { name, countryCode });
        const user: any = await User.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(userId) }
            },
           
            {
                $project: {
                    _id: 1,
                    "IsVerified": 1,
                    "preferredLanguage": 1,
                    "name": 1,
                    "email": 1,
                    "reference": 1,
                    "referredUsers": 1,
                    "username": 1,
                    "countryCode":1,
                }
            }

        ])
        res.json( user )
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})

userRouter.get('/validate-username/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({username : username})
        if(user) {
            res.json( {message: "Username already Exists", status: false}).status(200)
        } else {
            res.json( {message: "", status: true}).status(200)

        }
    } catch (error) {
        res.send({ err: error, status: false }).status(503)
    }
})








export interface IDeviceInfo {
    deviceName: string,
    deviceOS: string
}