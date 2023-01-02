"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var user_model_1 = require("../../models/user.model");
var mongoose_1 = __importDefault(require("mongoose"));
var userAuthenticate_middleware_1 = require("../../middlewares/userAuthenticate.middleware");
var user_helper_1 = require("./user-helper");
var moment_1 = __importDefault(require("moment"));
exports.userRouter = express_1.Router();
exports.userRouter.get('/user-profile/:userId', userAuthenticate_middleware_1.userAuthenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.User.aggregate([
                        {
                            $match: { _id: mongoose_1.default.Types.ObjectId(userId) }
                        },
                        {
                            $project: {
                                _id: 1,
                                "IsVerified": 1,
                                "preferredLanguage": 1,
                                "name": 1,
                                "email": 1,
                                "countryCode": 1,
                                "username": 1,
                                "reference": 1,
                                "referredUsers": 1
                            }
                        }
                    ])];
            case 2:
                user = _a.sent();
                delete user.password;
                delete user.verificationToken;
                delete user.VerificationDate;
                res.send(user).status(200);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.send({ err: "User not found" }).status(404);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userInput, hostname, deviceInfo, user, _a, user_1, resUser, token, userVerificationToken, e_1, resUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userInput = req.body.user;
                hostname = req.hostname;
                deviceInfo = req.body.deviceInfo;
                return [4 /*yield*/, user_helper_1._checkIfEmailExists(userInput.email)];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 10];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 8, , 9]);
                if (!userInput.password) {
                    throw 'Password Required';
                }
                _a = userInput;
                return [4 /*yield*/, user_helper_1.encryptPassword(userInput.password).catch(function (err) { return res.send(err); })];
            case 3:
                _a.password = _b.sent();
                userInput.createdDate = moment_1.default().utc();
                return [4 /*yield*/, user_model_1.User.create(userInput)];
            case 4:
                user_1 = _b.sent();
                resUser = user_1.toJSON();
                delete resUser.password;
                delete resUser.verificationToken;
                delete resUser.refernceIdUsed;
                return [4 /*yield*/, user_helper_1.generateToken(user_1, req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress, deviceInfo)];
            case 5:
                token = _b.sent();
                return [4 /*yield*/, user_helper_1.generateUserVerificationToken(resUser._id.toString())];
            case 6:
                userVerificationToken = _b.sent();
                return [4 /*yield*/, user_1.updateOne({ verificationToken: userVerificationToken }).exec()];
            case 7:
                _b.sent();
                user_helper_1.sendVerficationLink(resUser._id.toString(), resUser.email, userVerificationToken);
                res.json({ status: true }).status(200);
                return [3 /*break*/, 9];
            case 8:
                e_1 = _b.sent();
                res.send({ err: e_1, status: false }).status(503);
                return [3 /*break*/, 9];
            case 9: return [3 /*break*/, 11];
            case 10:
                if (!user.toJSON().IsVerified) {
                    resUser = user.toJSON();
                    delete resUser.password;
                    delete resUser.verificationToken;
                    delete resUser.refernceIdUsed;
                    user_helper_1.sendVerficationLink(resUser._id.toString(), resUser.email, user.verificationToken);
                    res.json({ status: true }).status(200);
                }
                else {
                    res.send({ err: 'Email Id Already Present', status: false }).status(401);
                }
                _b.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.get('/resendVerificationLink/:emailId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailId, user, verificationToken, userId, userEmail, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                emailId = req.params.emailId;
                return [4 /*yield*/, user_model_1.User.findOne({ email: emailId }).catch(function (err) { throw err; })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw "No Email with " + emailId + " found. Please register";
                }
                verificationToken = user.verificationToken;
                userId = user._id;
                userEmail = user.email;
                return [4 /*yield*/, user_helper_1.sendVerficationLink(userId, userEmail, verificationToken).catch(function (err) { throw err; })];
            case 2:
                _a.sent();
                res.json({ status: true }).status(200);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.json({ error: error_1, status: false }).status(503);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.get('/verify-account-plain-html', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // res.render('email-verify-success-plain');
        res.render('email-verify-failed-plain', { errorMessage: "Token invalid or expired!" });
        return [2 /*return*/];
    });
}); });
exports.userRouter.get('/verify-account/:userId/:verificationToken', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, verify, user, userObjId, refernceIdUsed, token, url, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                userId = req.params.userId;
                verify = req.params.verificationToken;
                return [4 /*yield*/, user_model_1.User.findById(userId)];
            case 1:
                user = _a.sent();
                if (!(user.verificationToken === verify && (!user.IsVerified))) return [3 /*break*/, 3];
                user.IsVerified = true;
                user.VerificationDate = new Date();
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(userId, user)];
            case 2:
                _a.sent();
                userObjId = user._id.toString();
                refernceIdUsed = user.refernceIdUsed ? user.refernceIdUsed.toString() : null;
                token = verify;
                url = process.env.FRONTEND_APP_DOMAIN + "/auth/email-verification-success";
                res.render('email-verify-success-plain');
                return [3 /*break*/, 4];
            case 3:
                if (user.verificationToken !== verify) {
                    throw 'InvalidToken';
                }
                else {
                    throw 'AlreadyVerified';
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                // const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-failed?err=${err}`
                if (err_2 === "InvalidToken") {
                    res.render('email-verify-failed-plain', { errorMessage: "Token invalid or expired!" });
                }
                else if (err_2 === "AlreadyVerified") {
                    res.render('email-verify-failed-plain', { errorMessage: "User Already Verified!" });
                }
                else {
                    res.render('email-verify-failed-plain', { errorMessage: "Email Verification Failed" });
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.get('/verify-account-email/:userId/:verificationToken', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, verify, user, userObjId, refernceIdUsed, token, url, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                userId = req.params.userId;
                verify = req.params.verificationToken;
                return [4 /*yield*/, user_model_1.User.findById(userId)];
            case 1:
                user = _a.sent();
                if (!(user.verificationToken === verify && (!user.IsVerified))) return [3 /*break*/, 3];
                user.IsVerified = true;
                user.VerificationDate = new Date();
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(userId, user)];
            case 2:
                _a.sent();
                userObjId = user._id.toString();
                refernceIdUsed = user.refernceIdUsed ? user.refernceIdUsed.toString() : null;
                token = verify;
                url = process.env.FRONTEND_APP_DOMAIN + "/auth/email-verification-success";
                res.render('email-verify-success-plain');
                return [3 /*break*/, 4];
            case 3:
                if (user.verificationToken !== verify) {
                    throw 'Invalid Verification Token';
                }
                else {
                    throw 'User Already Verified';
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                // const url = `${process.env.FRONTEND_APP_DOMAIN}/auth/email-verification-failed?err=${err}`
                res.render('email-verify-failed-plain', { errorMessage: err_3 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userEmail, userPassword, deviceInfo;
    return __generator(this, function (_a) {
        userEmail = req.body.email;
        userPassword = req.body.password;
        deviceInfo = req.body.deviceInfo;
        user_model_1.User.findOne({
            email: userEmail,
        }, function (err, user) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token, resUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 1];
                        res.send({ err: 'Email Id not found', status: false }).status(503);
                        return [3 /*break*/, 7];
                    case 1:
                        if (!(user && user.IsVerified === false)) return [3 /*break*/, 2];
                        res.send({ err: 'Please Verify your Email Address. ', isVerifiedEmailErr: true, status: false }).status(503);
                        return [3 /*break*/, 7];
                    case 2:
                        _a = user;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, user_helper_1.checkPassword(userPassword, user.get('password'))];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        if (!_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, user_helper_1.generateToken(user, req.clientIp, deviceInfo)];
                    case 5:
                        token = _b.sent();
                        resUser = user.toJSON();
                        delete resUser.password;
                        delete resUser.verificationToken;
                        delete resUser.refernceIdUsed;
                        res.json({ token: token, user: resUser }).status(200);
                        return [3 /*break*/, 7];
                    case 6:
                        res.send({ err: 'Email Id or Password incorrect', status: false }).status(401);
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
exports.userRouter.post('/logout', userAuthenticate_middleware_1.userAuthenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, tokenString, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user._id;
                tokenString = req.token;
                return [4 /*yield*/, user_helper_1.logoutUser(userId, tokenString)];
            case 1:
                _a.sent();
                res.json({ status: true }).status(200);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.send({ err: error_2, status: false }).status(503);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/updatePassword', userAuthenticate_middleware_1.userAuthenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newPassword, oldPassword, userObj, _a, password, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                userId = req.user._id;
                newPassword = req.body.newPassword;
                oldPassword = req.body.oldPassword;
                return [4 /*yield*/, user_model_1.User.findById(userId).catch(function (err) { throw (err); })];
            case 1:
                userObj = _b.sent();
                _a = userObj;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, user_helper_1.checkPassword(oldPassword, userObj.get('password'))];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                if (!_a) return [3 /*break*/, 6];
                return [4 /*yield*/, user_helper_1.encryptPassword(newPassword).catch(function (err) { throw (err); })];
            case 4:
                password = _b.sent();
                return [4 /*yield*/, user_model_1.User.findOneAndUpdate({ _id: userId }, { password: password })];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                res.send({ err: "Invalid Password", status: false }).status(503);
                _b.label = 7;
            case 7:
                res.json({ status: true }).status(200);
                return [3 /*break*/, 9];
            case 8:
                error_3 = _b.sent();
                res.send({ err: error_3, status: false }).status(503);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/forgotPassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, deviceInfo, user, userId, tokenString, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                email = req.body.email;
                deviceInfo = req.body.deviceInfo;
                return [4 /*yield*/, user_model_1.User.findOne({ email: email }).catch(function (err) { throw (err); })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                userId = user._id.toString();
                return [4 /*yield*/, user_helper_1.generateForgotPasswordToken(userId, req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress, deviceInfo)];
            case 2:
                tokenString = _a.sent();
                return [4 /*yield*/, user_helper_1.sendForgotPasswordLink(userId, email, tokenString)];
            case 3:
                _a.sent();
                res.json({ status: true }).status(200);
                return [3 /*break*/, 5];
            case 4: throw 'Email Not Found';
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                res.send({ err: error_4, status: false }).status(503);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/resetPassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPassword, tokenString, userId, password, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                newPassword = req.body.password;
                tokenString = req.body.tokenString;
                return [4 /*yield*/, user_helper_1.decodeForgotPasswordToken(tokenString)];
            case 1:
                userId = _a.sent();
                return [4 /*yield*/, user_helper_1.encryptPassword(newPassword).catch(function (err) { throw (err); })];
            case 2:
                password = _a.sent();
                return [4 /*yield*/, user_model_1.User.findOneAndUpdate({ _id: userId }, { password: password })];
            case 3:
                _a.sent();
                res.json({ status: true }).status(200);
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                res.send({ err: error_5, status: false }).status(503);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.put('/update-user', userAuthenticate_middleware_1.userAuthenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, name, countryCode, user, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user._id;
                name = req.body.name;
                countryCode = req.body.countryCode;
                return [4 /*yield*/, user_model_1.User.findByIdAndUpdate(userId, { name: name, countryCode: countryCode })];
            case 1:
                _a.sent();
                return [4 /*yield*/, user_model_1.User.aggregate([
                        {
                            $match: { _id: mongoose_1.default.Types.ObjectId(userId) }
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
                                "countryCode": 1,
                            }
                        }
                    ])];
            case 2:
                user = _a.sent();
                res.json(user);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.send({ err: error_6, status: false }).status(503);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.get('/validate-username/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.params.username;
                return [4 /*yield*/, user_model_1.User.findOne({ username: username })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.json({ message: "Username already Exists", status: false }).status(200);
                }
                else {
                    res.json({ message: "", status: true }).status(200);
                }
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.send({ err: error_7, status: false }).status(503);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=user.controller.js.map