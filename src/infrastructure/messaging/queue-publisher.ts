import { Logger } from '@nestjs/common';
import { IQueuePublisher } from './queue-publisher.interface';
import * as amqp from 'amqplib';

export class QueuePublisher implements IQueuePublisher {
  private rabbitUrl: string;
  private readonly logger = new Logger(QueuePublisher.name);

  constructor() {
    this.rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  }

  async publish(queue: string, message: any): Promise<void> {
    const conn = await amqp.connect(this.rabbitUrl);
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    
    await channel.close();
    await conn.close();
    this.logger.debug(`[RabbitMQ] Publicado na fila "${queue}":`, message);
  }
}
