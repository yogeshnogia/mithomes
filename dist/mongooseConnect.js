"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoose = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
function connectMongoose() {
    var dev_db_url = process.env.MONGO_CONNECTION_STRING;
    var mongoDB = process.env.MONGODB_URI || dev_db_url || '';
    mongoose_1.default.connect(mongoDB, { useNewUrlParser: true });
    mongoose_1.default.Promise = global.Promise;
    var db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
exports.connectMongoose = connectMongoose;
//# sourceMappingURL=mongooseConnect.js.map