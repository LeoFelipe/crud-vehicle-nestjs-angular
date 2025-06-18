import { Injectable, Inject } from '@nestjs/common';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class DeleteVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Validações do DTO (apenas o identificador)
    if (!id) {
      throw new Error('ID do veículo é obrigatório');
    }
    
    // 2. Buscar veículo existente
    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new Error('Veículo não encontrado');
    }
    
    // 3. Validações de Negócio (validar se pode desativar o veículo)
    if (!existingVeiculo.getStatus().podeSerDesativado()) {
      throw new Error('Veículo não pode ser desativado no status atual');
    }
    
    // 4. Adicionar Event de Veículo Desativado
    existingVeiculo.desativar();
    
    // 5. Atualizar o Veículo no banco (exclusão lógica)
    await this.veiculoRepository.update(existingVeiculo);
    
    // 6. Quando o veículo for atualizado, lançar os eventos que foram adicionados
    // (será feito pelo repository/notifier)
  }
} 