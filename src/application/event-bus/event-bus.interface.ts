import { DomainEvent } from '../../domain/events/domain-event';

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  register<T extends DomainEvent>(eventType: string, handler: (event: T) => Promise<void>): void;
} 