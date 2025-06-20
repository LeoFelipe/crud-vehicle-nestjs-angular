import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { BusinessException } from '../../../presentation/exceptions/business.exception';

@Injectable()
export class GetVeiculoByIdUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(id: string): Promise<VeiculoResponseDto> {
    if (!id) {
      throw new BusinessException('ID do veículo é obrigatório');
    }

    const veiculo = await this.veiculoRepository.findById(id);
    if (!veiculo) {
      throw new BusinessException('Veículo não encontrado');
    }

    return VeiculoMapper.toResponseDto(veiculo);
  }
}
