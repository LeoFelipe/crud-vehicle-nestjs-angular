import { Injectable, Inject } from '@nestjs/common';
import { CreateVeiculoDto } from '../../dto/create-veiculo.dto';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { Veiculo } from '../../../domain/entities/veiculo';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class CreateVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository
  ) {}

  async execute(dto: CreateVeiculoDto): Promise<VeiculoResponseDto> {
    // 1. Validações do DTO (já feitas pelo class-validator)
    
    // 2. Verificar se já existe veículo com placa, chassi ou renavam
    await this.validateUniqueConstraints(dto);
    
    // 3. Mapear DTO para Entidade
    const id = this.generateId();
    const veiculo = VeiculoMapper.toEntity(dto, id);
    
    // 4. Validações de Negócio (já feitas na entidade)
    
    // 5. Adicionar Event de Veículo Criado (já adicionado na entidade)
    
    // 6. Salvar o Veículo no banco
    await this.veiculoRepository.save(veiculo);
    
    // 7. Quando o veículo for salvo, lançar os eventos que foram adicionados
    // (será feito pelo repository/notifier)
    
    return VeiculoMapper.toResponseDto(veiculo);
  }

  private async validateUniqueConstraints(dto: CreateVeiculoDto): Promise<void> {
    const existingVeiculos = await this.veiculoRepository.findByPlacaOrChassiOrRenavam(
      dto.placa,
      dto.chassi,
      dto.renavam
    );

    if (existingVeiculos.length > 0) {
      const conflicts: string[] = [];
      
      for (const veiculo of existingVeiculos) {
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

      const uniqueConflicts = Array.from(new Set(conflicts));
      throw new Error(`Já existe um veículo com este(s) campo(s): ${uniqueConflicts.join(', ')}`);
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
} 