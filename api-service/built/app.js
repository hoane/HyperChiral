"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
exports.lambdaHandler = async (event, context) => {
    const out = JSON.stringify(event);
    return {
        statusCode: 200,
        body: out
    };
};
//# sourceMappingURL=app.js.map