"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = require("./routes");
var mongooseConnect_1 = require("./mongooseConnect");
var requestIp = require('request-ip');
var fs = require('fs');
var app = express_1.default();
var dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json({ limit: '50mb' }));
var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    exposedHeaders: ['x-auth', 'x-auth-admin']
};
//cors use in middleware 
app.use(cors_1.default(corsOptions));
app.set('trust proxy', true);
routes_1.routerConfig(app);
app.use(requestIp.mw({ attributeName: 'clientIp' }));
//Mongoose Connect
mongooseConnect_1.connectMongoose();
// View Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.get('/', function (req, res) {
    console.log(process.env.API_URL);
    // res.send('Hello World')
    res.render('index');
});
// var https = require('https');
// var privateKey = fs.readFileSync('/etc/letsencrypt/live/protonode.ga/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/protonode.ga/fullchain.pem', 'utf8');
// var credentials = { key: privateKey, cert: certificate };
// var server = require('https').createServer(credentials, app);
app.listen(3000, function () {
    return console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=index.js.map