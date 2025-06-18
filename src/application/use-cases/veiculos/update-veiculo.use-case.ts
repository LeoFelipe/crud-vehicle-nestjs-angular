import { Injectable, Inject } from '@nestjs/common';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { UpdateVeiculoDto } from '../../dto/update-veiculo.dto';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class UpdateVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository
  ) {}

  async execute(id: string, dto: UpdateVeiculoDto): Promise<VeiculoResponseDto> {
    // 1. Validações do DTO (já feitas pelo class-validator)
    
    // 2. Buscar veículo existente
    const existingVeiculo = await this.veiculoRepository.findById(id);
    if (!existingVeiculo) {
      throw new Error('Veículo não encontrado');
    }
    
    // 3. Verificar se já existe outro veículo com placa, chassi ou renavam
    await this.validateUniqueConstraintsForUpdate(id, dto);
    
    // 4. Mapear DTO para Entidade (atualizar propriedades)
    existingVeiculo.update(
      dto.placa,
      dto.chassi,
      dto.renavam,
      dto.modelo,
      dto.marca,
      dto.ano
    );
    
    // 5. Validações de Negócio (status do veículo deverá ser "em ativação")
    // (já feitas na entidade)
    
    // 6. Adicionar Event de Veículo Atualizado (já adicionado na entidade)
    
    // 7. Atualizar o Veículo no banco
    await this.veiculoRepository.update(existingVeiculo);
    
    // 8. Quando o veículo for atualizado, lançar os eventos que foram adicionados
    // (será feito pelo repository/notifier)
    
    return {
      id: existingVeiculo.getId(),
      placa: existingVeiculo.getPlaca(),
      chassi: existingVeiculo.getChassi(),
      renavam: existingVeiculo.getRenavam(),
      modelo: existingVeiculo.getModelo(),
      marca: existingVeiculo.getMarca(),
      ano: existingVeiculo.getAno(),
      status: existingVeiculo.getStatus().getValor(),
      createdAt: existingVeiculo.getCreatedAt(),
      updatedAt: existingVeiculo.getUpdatedAt()
    };
  }

  private async validateUniqueConstraintsForUpdate(id: string, dto: UpdateVeiculoDto): Promise<void> {
    const existingVeiculos = await this.veiculoRepository.findByPlacaOrChassiOrRenavam(
      dto.placa,
      dto.chassi,
      dto.renavam
    );

    const conflicts: string[] = [];
    
    for (const veiculo of existingVeiculos) {
      // Ignorar o próprio veículo que está sendo atualizado
      if (veiculo.getId() === id) {
        continue;
      }
      
      if (veiculo.getPlaca() === dto.placa) {
        conflicts.push('placa');
      }
      if (veiculo.getChassi() === dto.chassi) {
        conflicts.push('chassi');
      }
      if (veiculo.getRenavam() === dto.renavam) {
        conflicts.push('renavam');
      }
    }

    if (conflicts.length > 0) {
      const uniqueConflicts = Array.from(new Set(conflicts));
      throw new Error(`Já existe outro veículo com este(s) campo(s): ${uniqueConflicts.join(', ')}`);
    }
  }
} 