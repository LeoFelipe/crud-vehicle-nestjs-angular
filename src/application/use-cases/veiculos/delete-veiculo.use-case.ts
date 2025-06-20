import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class DeleteVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Validações do DTO (apenas o identificador)
    if (!id) {
      throw new Error('ID do veículo é obrigatório');
    }

    // 2. Buscar veículo existente
    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    // Regra: Apenas veículos EM_DESATIVACAO podem ser efetivamente deletados
    if (!existingVeiculo.status.podeSerDesativado()) {
      throw new Error(
        'Este veículo não pode ser deletado pois não está no status "em desativação"',
      );
    }

    // 4. Adicionar Event de Veículo Desativado
    existingVeiculo.solicitarDesativacao();

    // 5. Atualizar o Veículo no banco (exclusão lógica)
    await this.veiculoRepository.update(existingVeiculo);

    // 6. Quando o veículo for atualizado, lançar os eventos que foram adicionados
    // (será feito pelo repository/notifier)
  }
}
