import { Injectable, Inject } from '@nestjs/common';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class GetVeiculoByIdUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository
  ) {}

  async execute(id: string): Promise<VeiculoResponseDto> {
    if (!id) {
      throw new Error('ID do veículo é obrigatório');
    }

    const veiculo = await this.veiculoRepository.findById(id);
    if (!veiculo) {
      throw new Error('Veículo não encontrado');
    }

    return VeiculoMapper.toResponseDto(veiculo);
  }
} 