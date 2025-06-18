import { DomainEvent } from '../../domain/events/domain-event';

export interface IEventNotifier {
  notify(event: DomainEvent): Promise<void>;
  notifyAll(events: DomainEvent[]): Promise<void>;
} 