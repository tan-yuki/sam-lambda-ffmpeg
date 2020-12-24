"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, context) => {
    console.log(event, context);
    event.Records.forEach((record) => {
        const { body } = record;
        console.log(body);
    });
    return Promise.resolve();
};
exports.handler = handler;
//# sourceMappingURL=index.js.map