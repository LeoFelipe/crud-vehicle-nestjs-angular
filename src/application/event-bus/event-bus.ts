import { IEventBus } from './event-bus.interface';
import { DomainEvent } from '../../domain/events/domain-event';

export class EventBus implements IEventBus {
  private handlers: { [eventType: string]: ((event: DomainEvent) => Promise<void>)[] } = {};

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers[event.eventName] || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  register<T extends DomainEvent>(eventType: string, handler: (event: T) => Promise<void>): void {
    if (!this.handlers[eventType]) this.handlers[eventType] = [];
    this.handlers[eventType].push(handler as (event: DomainEvent) => Promise<void>);
  }
} 