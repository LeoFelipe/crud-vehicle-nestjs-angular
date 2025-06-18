import { Test, TestingModule } from '@nestjs/testing';
import { GetVeiculosUseCase } from './get-veiculos.use-case';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { Cache } from '../../../infrastructure/cache/cache.interface';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VEICULO_REPOSITORY, CACHE } from '../../../infrastructure/config/injection-tokens';

describe('GetVeiculosUseCase', () => {
  let useCase: GetVeiculosUseCase;
  let mockVeiculoRepository: jest.Mocked<VeiculoRepository>;
  let mockCache: jest.Mocked<Cache>;

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
      updatedAt: new Date()
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
      updatedAt: new Date()
    }
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
      // Arrange
      mockCache.get.mockResolvedValue(mockVeiculosResponse);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockCache.get).toHaveBeenCalledWith('veiculos:all');
      expect(mockVeiculoRepository.findAll).not.toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
      expect(result).toEqual(mockVeiculosResponse);
    });

    it('deve buscar do banco e salvar no cache quando cache está vazio', async () => {
      // Arrange
      const mockVeiculos = [
        {
          getId: jest.fn().mockReturnValue('1'),
          getPlaca: jest.fn().mockReturnValue('ABC1234'),
          getChassi: jest.fn().mockReturnValue('12345678901234567'),
          getRenavam: jest.fn().mockReturnValue('12345678901'),
          getModelo: jest.fn().mockReturnValue('Civic'),
          getMarca: jest.fn().mockReturnValue('Honda'),
          getAno: jest.fn().mockReturnValue(2023),
          getStatus: jest.fn().mockReturnValue({ getValor: () => 'ativo' }),
          getCreatedAt: jest.fn().mockReturnValue(new Date()),
          getUpdatedAt: jest.fn().mockReturnValue(new Date())
        }
      ];

      mockCache.get.mockResolvedValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue(mockVeiculos as any);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockCache.get).toHaveBeenCalledWith('veiculos:all');
      expect(mockVeiculoRepository.findAll).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalledWith('veiculos:all', result, 300);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', '1');
    });

    it('deve retornar lista vazia quando não há veículos', async () => {
      // Arrange
      mockCache.get.mockResolvedValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockCache.get).toHaveBeenCalledWith('veiculos:all');
      expect(mockVeiculoRepository.findAll).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalledWith('veiculos:all', [], 300);
      expect(result).toEqual([]);
    });

    it('deve lançar erro quando o repositório falha', async () => {
      // Arrange
      mockCache.get.mockResolvedValue(null);
      mockVeiculoRepository.findAll.mockRejectedValue(new Error('Erro no banco'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Erro no banco');
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o cache falha ao buscar', async () => {
      // Arrange
      mockCache.get.mockRejectedValue(new Error('Erro no cache'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Erro no cache');
      expect(mockVeiculoRepository.findAll).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o cache falha ao salvar', async () => {
      // Arrange
      const mockVeiculos = [
        {
          getId: jest.fn().mockReturnValue('1'),
          getPlaca: jest.fn().mockReturnValue('ABC1234'),
          getChassi: jest.fn().mockReturnValue('12345678901234567'),
          getRenavam: jest.fn().mockReturnValue('12345678901'),
          getModelo: jest.fn().mockReturnValue('Civic'),
          getMarca: jest.fn().mockReturnValue('Honda'),
          getAno: jest.fn().mockReturnValue(2023),
          getStatus: jest.fn().mockReturnValue({ getValor: () => 'ativo' }),
          getCreatedAt: jest.fn().mockReturnValue(new Date()),
          getUpdatedAt: jest.fn().mockReturnValue(new Date())
        }
      ];

      mockCache.get.mockResolvedValue(null);
      mockVeiculoRepository.findAll.mockResolvedValue(mockVeiculos as any);
      mockCache.set.mockRejectedValue(new Error('Erro ao salvar cache'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Erro ao salvar cache');
    });
  });
}); 