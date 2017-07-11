import { IIntents } from 'gabby-types';
export default function createEntity(intents: IIntents): {
    intent: string;
    examples: {
        text: string;
    }[];
    description: string;
}[];
