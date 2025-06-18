import { Injectable, Inject } from '@nestjs/common';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VeiculoMapper } from '../../mappers/veiculo.mapper';
import { Cache } from '../../../infrastructure/cache/cache.interface';
import { VEICULO_REPOSITORY, CACHE } from '../../../infrastructure/config/injection-tokens';

@Injectable()
export class GetVeiculosUseCase {
  private readonly CACHE_KEY = 'veiculos:all';
  private readonly CACHE_TTL = 300; // 5 minutos

  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    @Inject(CACHE)
    private readonly cache: Cache
  ) {}

  async execute(): Promise<VeiculoResponseDto[]> {
    // 1. Tentar obter o cache antes de ir fazer a consulta no banco
    const cachedVeiculos = await this.cache.get<VeiculoResponseDto[]>(this.CACHE_KEY);
    if (cachedVeiculos) {
      return cachedVeiculos;
    }
    
    // 2. Se não houver cache, buscar no banco
    const veiculos = await this.veiculoRepository.findAll();
    const veiculosDto = VeiculoMapper.toResponseDtoList(veiculos);
    
    // 3. Salvar no cache
    await this.cache.set(this.CACHE_KEY, veiculosDto, this.CACHE_TTL);
    
    return veiculosDto;
  }
} 