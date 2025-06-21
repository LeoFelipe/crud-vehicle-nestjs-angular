import { IDomainEvent } from '../../domain/events/domain-event';

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  register(eventName: string, handler: (event: any) => Promise<void>): void;
}
