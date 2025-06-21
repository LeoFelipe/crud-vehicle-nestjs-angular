import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { BusinessException } from '../../../presentation/exceptions/business.exception';

@Injectable()
export class DeleteVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new BusinessException('ID do veículo é obrigatório');
    }

    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    existingVeiculo.solicitarDesativacao();

    await this.veiculoRepository.update(existingVeiculo);
  }
}
