export interface OutboxMessageHeaders {
  type: string;
  content_type: string;
}

export interface OutboxMessageProperties {
  messageId: string;
  type: string;
  appId: string;
  contentType: string;
  headers: OutboxMessageHeaders;
}

export interface OutboxMessageBody {
  [key: string]: any;
}

export interface OutboxMessagePayload {
  message_id: string;
  type: string;
  exchange: string;
  routing_key: string;
  headers: OutboxMessageHeaders;
  properties: OutboxMessageProperties;
  body: OutboxMessageBody;
}

export interface OutboxMessageResponse {
  id: number;
  message_id: string;
  type: string;
  properties: OutboxMessageProperties;
  headers: OutboxMessageHeaders;
  body: OutboxMessageBody;
  sent_at?: Date | null;
  status: 'PENDING' | 'SENT';
}