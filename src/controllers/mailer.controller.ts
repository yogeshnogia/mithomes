
const nodemailer = require("nodemailer");
import { EmailFailed } from "../models/user.model";
import { key } from "../gmail-key";
const mailgun = require("mailgun-js");
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

export const mailer = (to: string, from: string, subject: string, body: string) => {
    return new Promise((resolve, reject) => {
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
              serviceClient: key.client_id,
              privateKey: key.private_key
            },
          });
    
          var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body,
          };
         
          transporter.sendMail(mailOptions, function (error: any, success: any) {
            if (error) {
                // reject('Something went wrong while sending you email....')
                EmailFailed.create(mailOptions);
            }
            resolve(true)
          });
    })
    
}

