import { Module } from '@nestjs/common';
import { VeiculoController } from './presentation/controllers/veiculo.controller';
import { CreateVeiculoUseCase } from './application/use-cases/veiculos/create-veiculo.use-case';
import { UpdateVeiculoUseCase } from './application/use-cases/veiculos/update-veiculo.use-case';
import { DeleteVeiculoUseCase } from './application/use-cases/veiculos/delete-veiculo.use-case';
import { GetVeiculosUseCase } from './application/use-cases/veiculos/get-veiculos.use-case';
import { GetVeiculoByIdUseCase } from './application/use-cases/veiculos/get-veiculo-by-id.use-case';
import { VeiculoRepositoryImpl } from './infrastructure/database/veiculo-repository.impl';
import { QueuePublisher } from './infrastructure/messaging/queue-publisher';
import { EventBus } from './application/event-bus/event-bus';
import { EVENT_BUS, VEICULO_REPOSITORY, CACHE, EVENT_NOTIFIER } from './infrastructure/config/injection-tokens';
import { MemoryCache } from './infrastructure/cache/memory-cache';
import { RabbitMQNotifier } from './infrastructure/messaging/rabbitmq-notifier';

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
      useClass: MemoryCache,
    },
    {
      provide: EVENT_NOTIFIER,
      useClass: RabbitMQNotifier,
    },
  ],
})
export class AppModule {}
