import { DomainEvent } from '../events/domain-event';

export abstract class BaseEntity {
  private _events: DomainEvent[] = [];

  get events(): DomainEvent[] {
    return [...this._events];
  }

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  public clearEvents(): void {
    this._events = [];
  }

  public hasEvents(): boolean {
    return this._events.length > 0;
  }
} 