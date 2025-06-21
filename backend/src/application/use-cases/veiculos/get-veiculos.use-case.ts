import { Injectable, Inject } from '@nestjs/common';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { ICache } from '../../../infrastructure/cache/cache.interface';
import {
  VEICULO_REPOSITORY,
  CACHE,
} from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class GetVeiculosUseCase {
  private readonly CACHE_KEY = 'veiculos:all';
  private readonly CACHE_TTL = 30; // 30 segundos

  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: IVeiculoRepository,
    @Inject(CACHE)
    private readonly cache: ICache,
  ) {}

  async execute(): Promise<VeiculoResponseDto[]> {
    // 1. Tentar obter o cache antes de ir fazer a consulta no banco
    const cachedVeiculos = this.cache.get<VeiculoResponseDto[]>(this.CACHE_KEY);
    if (cachedVeiculos) {
      return cachedVeiculos;
    }

    // 2. Se não houver cache, buscar no banco
    const veiculos = await this.veiculoRepository.findAll();
    const veiculosDto = VeiculoMapper.toResponseDtoList(veiculos);

    // 3. Salvar no cache SOMENTE se a lista não estiver vazia
    if (veiculosDto && veiculosDto.length > 0) {
      this.cache.set(this.CACHE_KEY, veiculosDto, this.CACHE_TTL);
    }

    return veiculosDto;
  }
}
