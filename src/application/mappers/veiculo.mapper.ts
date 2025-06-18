import { Veiculo } from '../../domain/entities/veiculo';
import { CreateVeiculoDto } from '../dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../dto/update-veiculo.dto';
import { VeiculoResponseDto } from '../dto/veiculo-response.dto';
import { StatusVeiculo } from '../../domain/value-objects/status-veiculo';

export class VeiculoMapper {
  static toEntity(dto: CreateVeiculoDto, id: string): Veiculo {
    return Veiculo.create(
      id,
      dto.placa,
      dto.chassi,
      dto.renavam,
      dto.modelo,
      dto.marca,
      dto.ano
    );
  }

  static toResponseDto(veiculo: Veiculo): VeiculoResponseDto {
    const dto = new VeiculoResponseDto();
    dto.id = veiculo.getId();
    dto.placa = veiculo.getPlaca();
    dto.chassi = veiculo.getChassi();
    dto.renavam = veiculo.getRenavam();
    dto.modelo = veiculo.getModelo();
    dto.marca = veiculo.getMarca();
    dto.ano = veiculo.getAno();
    dto.status = veiculo.getStatus().getValor();
    dto.createdAt = veiculo.getCreatedAt();
    dto.updatedAt = veiculo.getUpdatedAt();
    return dto;
  }

  static toResponseDtoList(veiculos: Veiculo[]): VeiculoResponseDto[] {
    return veiculos.map(veiculo => this.toResponseDto(veiculo));
  }
} 