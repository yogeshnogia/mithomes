"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
var nodemailer = require("nodemailer");
var user_model_1 = require("../models/user.model");
var gmail_key_1 = require("../gmail-key");
var mailgun = require("mailgun-js");
var MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
var MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
exports.mailer = function (to, from, subject, body) {
    return new Promise(function (resolve, reject) {
        var transporter = nodemailer.createTransport({
            port: 465,
            name: "gmail.com",
            secure: true,
            // secure: true,
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                type: "OAuth2",
                user: process.env.email,
                // pass :  process.env.password,
                serviceClient: gmail_key_1.key.client_id,
                privateKey: gmail_key_1.key.private_key
            },
        });
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body,
        };
        transporter.sendMail(mailOptions, function (error, success) {
            if (error) {
                // reject('Something went wrong while sending you email....')
                user_model_1.EmailFailed.create(mailOptions);
            }
            resolve(true);
        });
    });
};
//# sourceMappingURL=mailer.controller.js.map