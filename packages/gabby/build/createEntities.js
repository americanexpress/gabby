"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// map our easier to use interface to the more complicated watson interface
function createEntity(entities) {
    return entities.map(function (entity) { return ({
        entity: entity.name,
        fuzzy_match: entity.fuzzy || false,
        description: entity.description,
        values: entity.values.map(function (value) { return ({
            value: value.name,
            synonyms: value.synonyms,
        }); }),
    }); });
}
exports.default = createEntity;
