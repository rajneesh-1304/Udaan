import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { OutboxService } from "src/feature/services/outbox.service";
import { PublisherService } from "../rabbitMq/publisher";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const outbox = app.get(OutboxService);
  const publisher = app.get(PublisherService);

  const messages = await outbox.getPendingMsg();

  for (const msg of messages) {
    try {
      await publisher.publish(msg);
      await outbox.markDispatched(msg.id.toString());

    } catch (err) {
      console.error("Failed to process message:", msg.id, err);
    }
  }

  await app.close();
}
bootstrap();