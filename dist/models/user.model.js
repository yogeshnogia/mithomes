"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFailed = exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
exports.User = mongoose_1.default.model('User', new Schema({
    name: { type: String, required: true },
    email: { type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true, validate: [function (email) { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email); }, 'Please fill a valid email address'], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    gender: { type: String },
    username: { type: String, unique: true },
    occupation: { type: String },
    mobileNo: { type: String },
    countryCode: { type: String },
    createdDate: { type: Date },
    password: { type: String, required: true },
    verificationToken: { type: String },
    IsVerified: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: "en" },
    reference: { type: String },
    VerificationDate: { type: Date },
    profileImgUrl: { type: String },
    refernceIdUsed: { type: String },
    referredUsers: [{ type: mongoose_1.default.Types.ObjectId }]
}));
exports.User.createIndexes({ _id: 1 });
exports.EmailFailed = mongoose_1.default.model('EmailFailed', new Schema({
    from: String,
    to: String,
    subject: String,
    html: String,
}));
//# sourceMappingURL=user.model.js.map