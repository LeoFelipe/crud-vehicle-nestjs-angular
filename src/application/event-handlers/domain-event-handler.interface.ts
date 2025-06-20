import { IDomainEvent } from '../../domain/events/domain-event';

export interface IDomainEventHandler<T extends IDomainEvent> {
  handle(event: T): void;
}
