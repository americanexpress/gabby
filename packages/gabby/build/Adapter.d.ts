export declare type status = 'TRAINING' | 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
interface IGabbyAdapter {
    getWorkspaceStatus(): Promise<status>;
    applyChanges({routes, intents, entities}: {
        routes: any;
        intents: any;
        entities: any;
    }): Promise<{}>;
    sendMessage(msg: string, to?: string, context?: any): Promise<{
        conversationId: string;
        context: object;
        intents: object[];
        entities: object[];
        templateId: string;
    }>;
}
export default IGabbyAdapter;
