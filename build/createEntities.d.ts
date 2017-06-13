import { IEntities } from "./interfaces";
export default function createEntity(entities: IEntities): {
    entity: string;
    fuzzy_match: boolean;
    description: string;
    values: {
        value: string;
        synonyms: string[];
    }[];
}[];
