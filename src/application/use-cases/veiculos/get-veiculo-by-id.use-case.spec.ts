import { Test, TestingModule } from '@nestjs/testing';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { GetVeiculoByIdUseCase } from './get-veiculo-by-id.use-case';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('GetVeiculoByIdUseCase', () => {
  let useCase: GetVeiculoByIdUseCase;
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>;

  const mockVeiculo = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
    status: { getValor: () => 'ativo' },
    createdAt: new Date(),
    updatedAt: new Date(),
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
      mockVeiculoRepository.findById.mockResolvedValue(mockVeiculo as any);

      const result = await useCase.execute('test-id');

      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(expect.objectContaining({
        id: 'test-id',
        placa: 'ABC1234',
        chassi: '12345678901234567',
        renavam: '12345678901',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2023,
        status: 'ativo',
      }));
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      mockVeiculoRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(
        'Veículo não encontrado',
      );
    });

    it('deve lançar erro quando id é vazio', async () => {
      // Act & Assert
      await expect(useCase.execute('')).rejects.toThrow(
        'ID do veículo é obrigatório',
      );
    });
  });
});
