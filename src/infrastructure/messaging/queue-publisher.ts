import { IQueuePublisher } from './queue-publisher.interface';

export class QueuePublisher implements IQueuePublisher {
  private mode: 'inmemory' | 'rabbitmq';

  constructor(mode: 'inmemory' | 'rabbitmq' = 'inmemory') {
    this.mode = mode;
  }

  async publish(queue: string, message: any): Promise<void> {
    if (this.mode === 'inmemory') {
      // Apenas loga ou armazena em array
      console.log(`[InMemory] Publicado na fila "${queue}":`, message);
    } else if (this.mode === 'rabbitmq') {
      // Aqui vai a lógica real de publicação no RabbitMQ
      // Exemplo: await this.rabbitmqClient.publish(queue, message);
      console.log(`[RabbitMQ] (Simulado) Publicado na fila "${queue}":`, message);
    }
  }
} 