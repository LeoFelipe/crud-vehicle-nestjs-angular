import { Veiculo } from '../../domain/entities/veiculo';
import { CreateVeiculoRequestDto } from '../../presentation/requests/create-veiculo-request.dto';
import { VeiculoResponseDto } from '../../presentation/responses/veiculo-response.dto';

export class VeiculoMapper {
  static toDomain(dto: CreateVeiculoRequestDto): Veiculo {
    return Veiculo.create({
      placa: dto.placa,
      chassi: dto.chassi,
      renavam: dto.renavam,
      modelo: dto.modelo,
      marca: dto.marca,
      ano: dto.ano,
    });
  }

  static toResponseDto(veiculo: Veiculo): VeiculoResponseDto {
    const dto = new VeiculoResponseDto();
    dto.id = veiculo.id;
    dto.placa = veiculo.placa;
    dto.chassi = veiculo.chassi;
    dto.renavam = veiculo.renavam;
    dto.modelo = veiculo.modelo;
    dto.marca = veiculo.marca;
    dto.ano = veiculo.ano;
    dto.status = veiculo.status.getValor();
    dto.createdAt = veiculo.createdAt;
    dto.updatedAt = veiculo.updatedAt;
    return dto;
  }

  static toResponseDtoList(veiculos: Veiculo[]): VeiculoResponseDto[] {
    return veiculos.map(this.toResponseDto);
  }
}
