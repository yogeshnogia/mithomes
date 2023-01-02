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
exports.logoutUser = exports.sendForgotPasswordLink = exports.sendVerficationLink = exports.saveToken = exports.decodeForgotPasswordToken = exports.generateUserVerificationToken = exports.generateForgotPasswordToken = exports.generateToken = exports.checkPassword = exports._checkIfEmailExists = exports.encryptPassword = void 0;
var token_model_1 = require("../../models/token.model");
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var mailer_controller_1 = require("../mailer.controller");
var ejs = require('ejs');
var path = require('path');
var user_model_1 = require("../../models/user.model");
var moment_1 = __importDefault(require("moment"));
exports.encryptPassword = function (password) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
};
exports._checkIfEmailExists = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.User.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, user];
                return [2 /*return*/, false];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkPassword = function (password, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
exports.generateToken = function (user, ip, deviceInfo) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var tokenCreatedDate, userObj, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenCreatedDate = new Date().toUTCString();
                    userObj = user.toObject();
                    userObj.tokenCreatedDate = tokenCreatedDate;
                    token = jwt.sign(userObj, process.env.TOKEN_SECRET_KEY);
                    return [4 /*yield*/, exports.saveToken(token, ip, false, deviceInfo, user.toObject()._id, 'LoginToken')];
                case 1:
                    _a.sent();
                    resolve(token);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.generateForgotPasswordToken = function (userId, ip, deviceInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var object, tokenString, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                object = {
                    userId: userId,
                    tokenCreatedDate: moment_1.default.utc().toDate()
                };
                tokenString = jwt.sign(object, process.env.PASSWORD_RESET_KEY);
                return [4 /*yield*/, exports.saveToken(tokenString, ip, false, deviceInfo, userId, 'isForgotPasswordToken')];
            case 1:
                _a.sent();
                return [2 /*return*/, tokenString];
            case 2:
                error_2 = _a.sent();
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.generateUserVerificationToken = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var object, tokenString, deviceInfo, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                object = {
                    userId: userId,
                    tokenCreatedDate: moment_1.default.utc().toDate()
                };
                tokenString = jwt.sign(object, process.env.PASSWORD_RESET_KEY);
                deviceInfo = {
                    device: 'email',
                    os: '',
                    browser: '',
                    browser_version: ''
                };
                return [4 /*yield*/, exports.saveToken(tokenString, '', false, deviceInfo, userId, 'isEmailToken')];
            case 1:
                _a.sent();
                return [2 /*return*/, tokenString];
            case 2:
                error_3 = _a.sent();
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.decodeForgotPasswordToken = function (tokenString) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, token_model_1.Token.findOne({ tokenString: tokenString, isActive: true, isForgotPasswordToken: true })];
                        case 1:
                            token = _a.sent();
                            if (token) {
                                jwt.verify(tokenString, process.env.PASSWORD_RESET_KEY, function (err, decoded) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!err) return [3 /*break*/, 1];
                                                reject(err);
                                                return [3 /*break*/, 3];
                                            case 1: return [4 /*yield*/, token_model_1.Token.updateOne({ _id: token._id }, { isActive: false, lastUsedDate: new Date() })];
                                            case 2:
                                                _a.sent();
                                                resolve(token.userId);
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                            else {
                                reject("Link Invalid or Expired");
                            }
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.saveToken = function (tokenString, ip, isAPI, device, userId, type) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token_model_1.Token.create({
                        tokenString: tokenString,
                        userId: userId,
                        ip: ip,
                        deviceName: device.device || '',
                        deviceOS: device.os || '',
                        browser: device.browser || '',
                        browserVersion: device.browser_version || '',
                        isAPI: isAPI,
                        createdDate: moment_1.default.utc().toDate().toUTCString(),
                        isActive: true,
                        isForgotPasswordToken: type === "isForgotPasswordToken" ? true : false,
                        isEmailToken: type === "isEmailToken" ? true : false,
                    }).catch(function (err) { return reject(err); })];
                case 1:
                    token = _a.sent();
                    resolve(token);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.sendVerficationLink = function (userId, userEmail, verificationToken) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationLink, htmlBody, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                verificationLink = process.env.BACKEND_APP_DOMAIN + "/user/verify-account-email/" + userId + "/" + verificationToken + "?test=true";
                return [4 /*yield*/, ejs.renderFile(path.join(__dirname, '../../views/email-verification-template.ejs'), { url: verificationLink })];
            case 1:
                htmlBody = _a.sent();
                // const htmlBody = `Verify your email. `
                return [4 /*yield*/, mailer_controller_1.mailer(userEmail, process.env.email || '', ' Verification Email', htmlBody)];
            case 2:
                // const htmlBody = `Verify your email. `
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                throw error_4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendForgotPasswordLink = function (userId, userEmail, tokenString) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationLink, htmlBody, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                verificationLink = process.env.FRONTEND_APP_DOMAIN + "/auth/reset-password/" + userId + "/" + tokenString;
                return [4 /*yield*/, ejs.renderFile(path.join(__dirname, '../../views/forgot-password-template.ejs'), { url: verificationLink })];
            case 1:
                htmlBody = _a.sent();
                return [4 /*yield*/, mailer_controller_1.mailer(userEmail, process.env.email || '', 'Password Reset Email', htmlBody)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                throw error_5;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.logoutUser = function (userId, tokenString) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedToken;
    return __generator(this, function (_a) {
        try {
            updatedToken = token_model_1.Token.findOneAndUpdate({ tokenString: tokenString }, { isActive: false });
            return [2 /*return*/, updatedToken];
        }
        catch (error) {
            throw error;
        }
        return [2 /*return*/];
    });
}); };
//# sourceMappingURL=user-helper.js.map