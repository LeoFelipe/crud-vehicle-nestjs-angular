import { Injectable, Inject, Logger } from '@nestjs/common';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { CreateVeiculoRequestDto } from '../../../presentation/requests/create-veiculo-request.dto';
import { BusinessException } from '../../../presentation/exceptions/business.exception';

@Injectable()
export class CreateVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(dto: CreateVeiculoRequestDto): Promise<VeiculoResponseDto> {
    await this.checkForConflicts(dto);
    const veiculo = VeiculoMapper.toDomain(dto);

    await this.veiculoRepository.save(veiculo);

    return VeiculoMapper.toResponseDto(veiculo);
  }

  private async checkForConflicts(
    dto: CreateVeiculoRequestDto,
    idToIgnore?: string,
  ): Promise<void> {
    const existingVeiculos =
      await this.veiculoRepository.findByPlacaOrChassiOrRenavam(
        dto.placa,
        dto.chassi,
        dto.renavam,
      );

    const filteredVeiculos = existingVeiculos.filter(v => v.id !== idToIgnore);

    if (filteredVeiculos.length > 0) {
      const conflictFields = new Set<string>();
      for (const veiculo of filteredVeiculos) {
        if (veiculo.placa === dto.placa) conflictFields.add('placa');
        if (veiculo.chassi === dto.chassi) conflictFields.add('chassi');
        if (veiculo.renavam === dto.renavam) conflictFields.add('renavam');
      }
      if (conflictFields.size > 0) {
        throw new BusinessException(
          `Já existe um veículo com este(s) campo(s): ${Array.from(conflictFields).join(', ')}`,
        );
      }
    }
  }
}
