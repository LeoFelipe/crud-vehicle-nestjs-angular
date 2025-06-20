import { Injectable, Inject } from '@nestjs/common';
import { IDomainEventHandler } from './domain-event-handler.interface';
import { VeiculoEmDesativacaoEvent } from '../../domain/events/veiculo-em-desativacao.event';
import { IQueuePublisher } from '../../infrastructure/messaging/queue-publisher.interface';
import { QUEUE_PUBLISHER } from '../../infrastructure/config/injection-tokens';

@Injectable()
export class VeiculoEmDesativacaoHandler
  implements IDomainEventHandler<VeiculoEmDesativacaoEvent>
{
  constructor(
    @Inject(QUEUE_PUBLISHER) private readonly publisher: IQueuePublisher,
  ) {}

  async handle(event: VeiculoEmDesativacaoEvent): Promise<void> {
    await this.publisher.publish('veiculo-em-desativacao', event);
  }
}
