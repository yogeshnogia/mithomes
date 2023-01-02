"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerConfig = void 0;
var user_controller_1 = require("./controllers/user/user.controller");
function routerConfig(app) {
    app.use('/user', user_controller_1.userRouter);
}
exports.routerConfig = routerConfig;
//# sourceMappingURL=routes.js.map