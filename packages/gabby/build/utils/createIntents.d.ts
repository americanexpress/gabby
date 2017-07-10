import { IIntents } from '../interfaces';
export default function createEntity(intents: IIntents): {
    intent: string;
    examples: {
        text: string;
    }[];
    description: string;
}[];
