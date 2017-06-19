import { IIntents } from './interfaces';

// map our easier to use interface to the more complicated watson interface
export default function createEntity(intents: IIntents) {
  return intents.map(intent => ({
    intent: intent.name,
    examples: intent.phrases.map(text => ({ text })),
    description: intent.description,
  }));
}
