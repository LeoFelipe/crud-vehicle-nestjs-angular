import { IDomainEvent } from '../events/domain-event';
import { randomUUID } from 'crypto';

export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected readonly props: T;
  private readonly _events: IDomainEvent[] = [];

  constructor(props: T, id?: string) {
    this._id = id || randomUUID();
    this.props = props;
  }

  public get events(): IDomainEvent[] {
    return this._events;
  }

  protected addEvent(event: IDomainEvent): void {
    this._events.push(event);
  }

  public clearEvents(): void {
    this._events.length = 0;
  }

  public hasEvents(): boolean {
    return this._events.length > 0;
  }
}
