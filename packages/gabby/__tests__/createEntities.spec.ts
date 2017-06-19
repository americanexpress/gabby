import createEntities from '../src/createEntities';

describe('Create entities', () => {
  it('should return valid watson structure', () => {
    expect(createEntities([
      {
        name: 'animals',
        values: [
          {
            name: 'cat',
            synonyms: ['not dog']
          }
        ],
        description: 'a furry animal',
      }
    ])).toEqual([
      {
        entity: 'animals',
        values: [
          {
            value: 'cat',
            synonyms: ['not dog'],
          },
        ],
        fuzzy_match: false,
        description: 'a furry animal',
      },
    ]);
  });
});
