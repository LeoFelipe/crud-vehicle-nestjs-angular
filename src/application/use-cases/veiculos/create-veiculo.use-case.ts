import { Injectable, Inject, Logger } from '@nestjs/common';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { CreateVeiculoRequestDto } from '../../../presentation/requests/create-veiculo-request.dto';

@Injectable()
export class CreateVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateVeiculoRequestDto): Promise<VeiculoResponseDto> {
    // 1. Validações do DTO (já feitas pelo class-validator)

    // 2. Verificar se já existe veículo com placa, chassi ou renavam
    await this.checkForConflicts(dto);

    // 3. Mapear DTO para Entidade
    const id = this.generateId();
    const veiculo = VeiculoMapper.toDomain(dto);

    // 4. Validações de Negócio (já feitas na entidade)

    // 5. Adicionar Event de Veículo Criado (já adicionado na entidade)

    // 6. Salvar o Veículo no banco
    await this.veiculoRepository.save(veiculo);

    // 7. Quando o veículo for salvo, lançar os eventos que foram adicionados
    // (será feito pelo repository/notifier)

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
        throw new Error(
          `Já existe um veículo com este(s) campo(s): ${Array.from(conflictFields).join(', ')}`,
        );
      }
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
