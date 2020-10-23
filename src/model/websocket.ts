export interface WebsocketMessage {
    type: WebsocketType;
    message: string;
}
export type WebsocketType = "clarify";