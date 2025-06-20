import { IDomainEvent } from '../../domain/events/domain-event';
import { IEventBus } from './event-bus.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventBus implements IEventBus {
  private readonly logger = new Logger(EventBus.name);
  private handlers: {
    [eventName: string]: ((event: any) => Promise<void>)[];
  } = {};

  async publish(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers[eventName];

    if (handlers) {
      this.logger.log(`Handling event: ${eventName}`);
      await Promise.all(handlers.map(handler => handler(event)));
    }
  }

  register(eventName: string, handler: (event: any) => Promise<void>): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    this.logger.log(`Registered handler for event: ${eventName}`);
  }
}
