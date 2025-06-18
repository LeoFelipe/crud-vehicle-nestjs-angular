import { Test, TestingModule } from '@nestjs/testing';
import { GetVeiculoByIdUseCase } from './get-veiculo-by-id.use-case';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VeiculoResponseDto } from '../../dto/veiculo-response.dto';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('GetVeiculoByIdUseCase', () => {
  let useCase: GetVeiculoByIdUseCase;
  let mockVeiculoRepository: jest.Mocked<VeiculoRepository>;

  const mockVeiculo = {
    getId: jest.fn().mockReturnValue('test-id'),
    getPlaca: jest.fn().mockReturnValue('ABC1234'),
    getChassi: jest.fn().mockReturnValue('12345678901234567'),
    getRenavam: jest.fn().mockReturnValue('12345678901'),
    getModelo: jest.fn().mockReturnValue('Civic'),
    getMarca: jest.fn().mockReturnValue('Honda'),
    getAno: jest.fn().mockReturnValue(2023),
    getStatus: jest.fn().mockReturnValue({ getValor: () => 'ativo' }),
    getCreatedAt: jest.fn().mockReturnValue(new Date()),
    getUpdatedAt: jest.fn().mockReturnValue(new Date())
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVeiculoByIdUseCase,
        {
          provide: VEICULO_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetVeiculoByIdUseCase>(GetVeiculoByIdUseCase);
    mockVeiculoRepository = module.get(VEICULO_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve retornar o veículo quando encontrado', async () => {
      // Arrange
      mockVeiculoRepository.findById.mockResolvedValue(mockVeiculo as any);

      // Act
      const result = await useCase.execute('test-id');

      // Assert
      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toHaveProperty('id', 'test-id');
      expect(result.placa).toBe('ABC1234');
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      // Arrange
      mockVeiculoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('not-found')).rejects.toThrow('Veículo não encontrado');
    });

    it('deve lançar erro quando id é vazio', async () => {
      // Act & Assert
      await expect(useCase.execute('')).rejects.toThrow('ID do veículo é obrigatório');
    });
  });
}); 