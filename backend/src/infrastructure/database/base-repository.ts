import { IDomainEvent } from '../../domain/events/domain-event';
import { BaseEntity } from '../../domain/entities/base-entity';
import { IEventBus } from '../../application/event-bus/event-bus.interface';

export abstract class BaseRepository {
  constructor(protected readonly eventBus: IEventBus) {}

  protected async dispatchEvents(entity: BaseEntity<any>): Promise<void> {
    const allEvents: IDomainEvent[] = [];

    // Adiciona eventos da entidade principal
    allEvents.push(...entity.events);

    // TODO: Adicionar lógica para buscar eventos de agregados, se houver

    // Dispara todos os eventos
    for (const event of allEvents) {
      await this.eventBus.publish(event);
    }

    // Limpa os eventos da entidade
    entity.clearEvents();
  }

  protected async dispatchEventsFromMultiple(
    entities: BaseEntity<any>[],
  ): Promise<void> {
    const allEvents: IDomainEvent[] = [];
    for (const entity of entities) {
      if (entity.events.length > 0) {
        allEvents.push(...entity.events);
        entity.clearEvents();
      }
    }

    for (const event of allEvents) {
      await this.eventBus.publish(event);
    }
  }
}
