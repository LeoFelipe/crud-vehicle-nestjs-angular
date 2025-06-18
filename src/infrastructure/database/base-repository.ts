import { IEventBus } from '../../application/event-bus/event-bus.interface';
import { DomainEvent } from '../../domain/events/domain-event';
import { BaseEntity } from '../../domain/entities/base-entity';

export abstract class BaseRepository {
  constructor(protected readonly eventBus: IEventBus) {}

  protected async dispatchEvents(entity: BaseEntity): Promise<void> {
    if (entity.hasEvents()) {
      const events = entity.events;
      entity.clearEvents();
      for (const event of events) {
        await this.eventBus.publish(event);
      }
    }
  }

  protected async dispatchEventsFromMultiple(entities: BaseEntity[]): Promise<void> {
    const allEvents: DomainEvent[] = [];
    for (const entity of entities) {
      if (entity.hasEvents()) {
        allEvents.push(...entity.events);
        entity.clearEvents();
      }
    }
    for (const event of allEvents) {
      await this.eventBus.publish(event);
    }
  }
} 