import { Test, TestingModule } from '@nestjs/testing';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { GetVeiculosUseCase } from './get-veiculos.use-case';
import { VeiculoResponseDto } from '../../../presentation/responses/veiculo-response.dto';
import {
  VEICULO_REPOSITORY,
  CACHE,
} from '../../../infrastructure/config/injection-tokens';
import { ICache } from '../../../infrastructure/cache/cache.interface';

describe('GetVeiculosUseCase', () => {
  let useCase: GetVeiculosUseCase;
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>;
  let mockCache: jest.Mocked<ICache>;

  const mockVeiculosResponse: VeiculoResponseDto[] = [
    {
      id: '1',
      placa: 'ABC1234',
      chassi: '12345678901234567',
      renavam: '12345678901',
      modelo: 'Civic',
      marca: 'Honda',
      ano: 2023,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      placa: 'XYZ5678',
      chassi: '98765432109876543',
      renavam: '98765432109',
      modelo: 'Corolla',
      marca: 'Toyota',
      ano: 2024,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVeiculosUseCase,
        {
          provide: VEICULO_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: CACHE,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVeiculosUseCase>(GetVeiculosUseCase);
    mockVeiculoRepository = module.get(VEICULO_REPOSITORY);
    mockCache = module.get(CACHE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve retornar veículos do cache quando disponível', async () => {
      (mockCache.get as jest.Mock).mockReturnValue(mockVeiculosResponse);

      const result = await useCase.execute();

      expect(mockCache.get).toHaveBeenCalledWith('veiculos:all');
      expect(mockVeiculoRepository.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(mockVeiculosResponse);
    });

    it('deve buscar do repositório e salvar no cache quando cache está vazio', async () => {
      const mockVeiculos = [
        {
          id: '1',
          placa: 'ABC1234',
          chassi: '12345678901234567',
          renavam: '12345678901',
          modelo: 'Civic',
          marca: 'Honda',
          ano: 2023,
          status: { getValor: () => 'ativo' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          placa: 'XYZ5678',
          chassi: '98765432109876543',
          renavam: '98765432109',
          modelo: 'Corolla',
          marca: 'Toyota',
          ano: 2024,
          status: { getValor: () => 'ativo' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockCache.get as jest.Mock).mockReturnValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue(mockVeiculos as any);

      const result = await useCase.execute();

      expect(mockCache.get).toHaveBeenCalledWith('veiculos:all');
      expect(mockVeiculoRepository.findAll).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalledWith('veiculos:all', result, 60);
      expect(result).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há veículos', async () => {
      (mockCache.get as jest.Mock).mockReturnValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockVeiculoRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando repositório falha', async () => {
      (mockCache.get as jest.Mock).mockReturnValue(null);
      mockVeiculoRepository.findAll.mockRejectedValue(
        new Error('Erro no repositório'),
      );

      await expect(useCase.execute()).rejects.toThrow('Erro no repositório');
    });

    it('deve não salvar no cache quando lista está vazia', async () => {
      (mockCache.get as jest.Mock).mockReturnValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue([]);

      await useCase.execute();

      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando cache falha ao buscar', async () => {
      (mockCache.get as jest.Mock).mockRejectedValue(new Error('Erro no cache'));

      await expect(useCase.execute()).rejects.toThrow('Erro no cache');
    });

    it('deve lançar erro quando cache falha ao salvar', async () => {
      const mockVeiculos = [
        {
          id: '1',
          placa: 'ABC1234',
          chassi: '12345678901234567',
          renavam: '12345678901',
          modelo: 'Civic',
          marca: 'Honda',
          ano: 2023,
          status: { getValor: () => 'ativo' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockCache.get as jest.Mock).mockReturnValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue(mockVeiculos as any);
      (mockCache.set as jest.Mock).mockImplementation(() => {
        throw new Error('Erro ao salvar cache');
      });

      await expect(useCase.execute()).rejects.toThrow('Erro ao salvar cache');
    });
  });
});
