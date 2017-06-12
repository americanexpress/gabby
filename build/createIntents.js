"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// map our easier to use interface to the more complicated watson interface
function createEntity(intents) {
    return intents.map(function (intent) { return ({
        intent: intent.name,
        examples: intent.phrases.map(function (text) { return ({ text: text }); }),
        description: intent.description,
    }); });
}
exports.default = createEntity;
