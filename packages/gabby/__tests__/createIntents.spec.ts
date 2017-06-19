import createIntents from '../src/createIntents';

describe('Create intents', () => {
  it('should return valid watson structure', () => {
    expect(createIntents([
      {
        name: 'Confirm',
        phrases: ['yes', 'confirm', 'sure'],
      },
    ])).toEqual([
      {
        intent: 'Confirm',
        examples: [
          { text: 'yes' },
          { text: 'confirm' },
          { text: 'sure' },
        ],
      },
    ]);
  });
});
