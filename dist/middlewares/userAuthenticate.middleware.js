"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthenticate = void 0;
var token_model_1 = require("../models/token.model");
var jwt = require('jsonwebtoken');
function userAuthenticate(req, res, next) {
    var tokenString = req.header('x-auth');
    jwt.verify(tokenString, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
        if (err) {
            //console.log(err);
            res.status(401).send({ message: 'Unauthorized Access. Please Login Again', status: false });
        }
        else {
            updateToken(tokenString).then(function (token) {
                if (!token) {
                    throw 'invalid token';
                }
                var tokenObj = token.toObject();
                req.user = tokenObj.userId;
                req.token = tokenObj.tokenString;
                next();
            })
                .catch(function (err) {
                res.status(401).send({ message: 'Unauthorized Access. Please Login Again', status: false });
            });
        }
    });
}
exports.userAuthenticate = userAuthenticate;
;
var updateToken = function (tokenString) {
    // Implement TOKEN Expiration here if needed
    return token_model_1.Token.findOneAndUpdate({ tokenString: tokenString, isActive: true }, { lastUsedDate: new Date() });
};
//# sourceMappingURL=userAuthenticate.middleware.js.map