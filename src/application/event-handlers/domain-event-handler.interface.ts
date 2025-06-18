import { DomainEvent } from '../../domain/events/domain-event';

export interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
} 