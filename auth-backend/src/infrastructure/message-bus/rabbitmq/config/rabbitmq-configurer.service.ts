import { Injectable } from "@nestjs/common";
import { RabbitMQConnectionService } from "./rabbitmq-connection.service";
import { ConfigType, ExchangeConfig } from "./rabbitmq.interface";

@Injectable()
export class RabbitMQConfigurerService {
    private connection: RabbitMQConnectionService;

    constructor(
        private rabbitmqConnectionService: RabbitMQConnectionService,
    ) {
        this.connection = this.rabbitmqConnectionService;
    }

    private get config(): ConfigType {
        return this.connection.getConnectionConfiguration();
    }

    async configureExchange(exchangeConfig: ExchangeConfig): Promise<void> {
        if (!exchangeConfig.name || !exchangeConfig.type) {
            throw new Error('Exchange name and type must be provided.');
        }
        await this.rabbitmqConnectionService.exchange(exchangeConfig.name, exchangeConfig.type);
    }

    async configureExchanges(exchanges: ExchangeConfig[]): Promise<void> {
        const uniqueExchanges = [
            ...new Map(exchanges.map((exchange) => [exchange.name, exchange])).values(),
        ];

        for (const exchange of uniqueExchanges) {
            await this.configureExchange(exchange);
        }
    }

}