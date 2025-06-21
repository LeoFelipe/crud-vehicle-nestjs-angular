import { QueueConsumer } from './queue-consumer';
import { VeiculoRepositoryImpl } from '../database/veiculo-repository.impl';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const consumer = new QueueConsumer();
  const repo = new VeiculoRepositoryImpl({} as any); // Injetar EventBus se necessário

  await consumer.consume('veiculo-em-ativacao', async (event) => {    
    if (!event.veiculoId) {
      console.error('Mensagem sem ID de veículo:', event);
      return;
    }

    const veiculo = await repo.findById(event.veiculoId);
    if (!veiculo) {
      console.error('Veículo não encontrado:', event.veiculoId);
      return;
    }
    
    try {
      veiculo.ativar();
      await repo.update(veiculo);
      console.log(`Veículo ativado:`, veiculo);
    } catch (err) {
      console.error('Erro ao ativar veículo:', err);
    }
  });
}

main();
