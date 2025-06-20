import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { VeiculoController } from './presentation/controllers/veiculo.controller';
import { CreateVeiculoUseCase } from './application/use-cases/veiculos/create-veiculo.use-case';
import { UpdateVeiculoUseCase } from './application/use-cases/veiculos/update-veiculo.use-case';
import { DeleteVeiculoUseCase } from './application/use-cases/veiculos/delete-veiculo.use-case';
import { GetVeiculosUseCase } from './application/use-cases/veiculos/get-veiculos.use-case';
import { GetVeiculoByIdUseCase } from './application/use-cases/veiculos/get-veiculo-by-id.use-case';
import { VeiculoRepositoryImpl } from './infrastructure/database/veiculo-repository.impl';
import { QueuePublisher } from './infrastructure/messaging/queue-publisher';
import { EventBus } from './application/event-bus/event-bus';
import {
  EVENT_BUS,
  VEICULO_REPOSITORY,
  CACHE,
  QUEUE_PUBLISHER,
} from './infrastructure/config/injection-tokens';
import { Cache } from './infrastructure/cache/cache';
import { VeiculoCriadoHandler } from './application/event-handlers/veiculo-criado.handler';
import { VeiculoEmDesativacaoHandler } from './application/event-handlers/veiculo-em-desativacao.handler';
import { VeiculoCriadoEvent } from './domain/events/veiculo-criado.event';
import { VeiculoEmDesativacaoEvent } from './domain/events/veiculo-em-desativacao.event';

@Module({
  imports: [],
  controllers: [VeiculoController],
  providers: [
    // Use Cases
    CreateVeiculoUseCase,
    UpdateVeiculoUseCase,
    DeleteVeiculoUseCase,
    GetVeiculosUseCase,
    GetVeiculoByIdUseCase,

    // EventBus
    {
      provide: EVENT_BUS,
      useClass: EventBus,
    },

    // Infrastructure
    {
      provide: VEICULO_REPOSITORY,
      useClass: VeiculoRepositoryImpl,
    },
    {
      provide: CACHE,
      useClass: Cache,
    },
    {
      provide: QUEUE_PUBLISHER,
      useClass: QueuePublisher,
    },
    VeiculoCriadoHandler,
    VeiculoEmDesativacaoHandler,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
    private readonly veiculoCriadoHandler: VeiculoCriadoHandler,
    private readonly veiculoEmDesativacaoHandler: VeiculoEmDesativacaoHandler,
  ) {}

  onModuleInit() {
    this.eventBus.register('VeiculoCriado', (event) =>
      this.veiculoCriadoHandler.handle(event as VeiculoCriadoEvent),
    );
    this.eventBus.register('VeiculoEmDesativacao', (event) =>
      this.veiculoEmDesativacaoHandler.handle(
        event as VeiculoEmDesativacaoEvent,
      ),
    );
  }
}
