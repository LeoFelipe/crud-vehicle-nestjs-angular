import * as amqp from 'amqplib';

export class QueueConsumer {
  private rabbitUrl: string;

  constructor() {
    this.rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  }

  async consume(
    queue: string,
    onMessage: (msg: any) => Promise<void>,
  ): Promise<void> {
    const conn = await amqp.connect(this.rabbitUrl);
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(`[RabbitMQ] Consumindo fila: ${queue}`);
    channel.consume(queue, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        try {
          await onMessage(content);
          channel.ack(msg);
        } catch (err) {
          console.error('Erro ao processar mensagem:', err);
          // Não faz ack, mensagem será reprocessada
        }
      }
    });
  }
}
