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
    if (!id) {
      throw new Error('ID do veículo é obrigatório');
    }

    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    existingVeiculo.solicitarDesativacao();

    await this.veiculoRepository.update(existingVeiculo);
  }
}
