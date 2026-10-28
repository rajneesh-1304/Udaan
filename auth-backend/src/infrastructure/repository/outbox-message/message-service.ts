export interface MessageDestination {
  exchange: string;
  routingKey: string;
}

export class MessageDestinationService {
  private static destinations: Record<string, MessageDestination> = {
    'auth.user.registered': {
      exchange: process.env.RABBITMQ_FANOUT_EXCHANGE || 'auth_fanout_exchange',
      routingKey: '',
    },
  };

  static get(messageType: string): MessageDestination {
    const destination = this.destinations[messageType];
    if (!destination) {
      return {
        exchange: process.env.RABBITMQ_FANOUT_EXCHANGE || 'auth_fanout_exchange',
        routingKey: '',
      };
    }
    return {
      exchange: process.env.RABBITMQ_FANOUT_EXCHANGE || destination.exchange,
      routingKey: destination.routingKey,
    };
  }
}