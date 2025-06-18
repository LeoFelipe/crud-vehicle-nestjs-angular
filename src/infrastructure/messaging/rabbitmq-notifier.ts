import { Injectable, Logger } from '@nestjs/common';
import { IEventNotifier } from './event-notifier.interface';
import { DomainEvent } from '../../domain/events/domain-event';

@Injectable()
export class RabbitMQNotifier implements IEventNotifier {
  private readonly logger = new Logger(RabbitMQNotifier.name);

  async notify(event: DomainEvent): Promise<void> {
    try {
      this.logger.log(`Enviando evento ${event.eventName} para RabbitMQ`);
      
      // Aqui seria feita a implementação real do RabbitMQ
      // Por enquanto, apenas logamos o evento
      await this.publishToQueue(event);
      
      this.logger.log(`Evento ${event.eventName} enviado com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao enviar evento ${event.eventName}:`, error);
      throw error;
    }
  }

  async notifyAll(events: DomainEvent[]): Promise<void> {
    this.logger.log(`Enviando ${events.length} eventos para RabbitMQ`);
    
    for (const event of events) {
      await this.notify(event);
    }
  }

  private async publishToQueue(event: DomainEvent): Promise<void> {
    // Simulação de envio para RabbitMQ
    // Em uma implementação real, aqui seria usado amqplib ou similar
    const message = {
      eventName: event.eventName,
      occurredOn: event.occurredOn,
      data: event
    };

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.debug(`Mensagem publicada: ${JSON.stringify(message)}`);
  }
} 