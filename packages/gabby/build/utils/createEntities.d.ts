import { IEntities } from 'gabby-types';
export default function createEntity(entities: IEntities): {
    entity: string;
    fuzzy_match: boolean;
    description: string;
    values: {
        value: string;
        synonyms: string[];
    }[];
}[];
