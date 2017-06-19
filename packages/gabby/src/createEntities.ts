import { IEntities } from './interfaces';

// map our easier to use interface to the more complicated watson interface
export default function createEntity(entities: IEntities) {
  return entities.map(entity => ({
    entity: entity.name,
    fuzzy_match: entity.fuzzy || false,
    description: entity.description,
    values: entity.values.map(value => ({
      value: value.name,
      synonyms: value.synonyms,
    })),
  }));
}
