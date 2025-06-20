import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { UpdateVeiculoRequestDto } from '../../../presentation/requests/update-veiculo-request.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';

@Injectable()
export class UpdateVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateVeiculoRequestDto,
  ): Promise<VeiculoResponseDto> {
    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    await this.checkForConflicts(dto, id);

    existingVeiculo.update({
      placa: dto.placa,
      chassi: dto.chassi,
      renavam: dto.renavam,
      modelo: dto.modelo,
      marca: dto.marca,
      ano: dto.ano,
    });

    await this.veiculoRepository.update(existingVeiculo);
    return VeiculoMapper.toResponseDto(existingVeiculo);
  }

  private async checkForConflicts(
    dto: UpdateVeiculoRequestDto,
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
        throw new Error(
          `Já existe um veículo com este(s) campo(s): ${Array.from(
            conflictFields,
          ).join(', ')}`,
        );
      }
    }
  }
}
