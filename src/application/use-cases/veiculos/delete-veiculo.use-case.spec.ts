import { Test, TestingModule } from '@nestjs/testing';
import { DeleteVeiculoUseCase } from './delete-veiculo.use-case';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('DeleteVeiculoUseCase', () => {
  let useCase: DeleteVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<VeiculoRepository>;

  const mockVeiculo = {
    getId: jest.fn().mockReturnValue('test-id'),
    getPlaca: jest.fn().mockReturnValue('ABC1234'),
    getChassi: jest.fn().mockReturnValue('12345678901234567'),
    getRenavam: jest.fn().mockReturnValue('12345678901'),
    getModelo: jest.fn().mockReturnValue('Civic'),
    getMarca: jest.fn().mockReturnValue('Honda'),
    getAno: jest.fn().mockReturnValue(2023),
    getStatus: jest.fn().mockReturnValue({ 
      getValor: () => 'ativo',
      podeSerDesativado: jest.fn().mockReturnValue(true)
    }),
    getCreatedAt: jest.fn().mockReturnValue(new Date()),
    getUpdatedAt: jest.fn().mockReturnValue(new Date()),
    desativar: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteVeiculoUseCase,
        {
          provide: VEICULO_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteVeiculoUseCase>(DeleteVeiculoUseCase);
    mockVeiculoRepository = module.get(VEICULO_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve desativar um veículo com sucesso', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.update.mockResolvedValue();

      // Act
      await useCase.execute('test-id');

      // Assert
      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(existingVeiculo.desativar).toHaveBeenCalled();
      expect(mockVeiculoRepository.update).toHaveBeenCalledWith(existingVeiculo);
    });

    it('deve lançar erro quando ID é vazio', async () => {
      // Act & Assert
      await expect(useCase.execute('')).rejects.toThrow('ID do veículo é obrigatório');
      expect(mockVeiculoRepository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando ID é null', async () => {
      // Act & Assert
      await expect(useCase.execute(null as any)).rejects.toThrow('ID do veículo é obrigatório');
      expect(mockVeiculoRepository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      // Arrange
      mockVeiculoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-id')).rejects.toThrow('Veículo não encontrado');
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando veículo não pode ser desativado', async () => {
      // Arrange
      const existingVeiculo = {
        ...mockVeiculo,
        getStatus: jest.fn().mockReturnValue({ 
          getValor: () => 'desativado',
          podeSerDesativado: jest.fn().mockReturnValue(false)
        })
      };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);

      // Act & Assert
      await expect(useCase.execute('test-id')).rejects.toThrow('Veículo não pode ser desativado no status atual');
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha ao atualizar', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.update.mockRejectedValue(new Error('Erro ao atualizar'));

      // Act & Assert
      await expect(useCase.execute('test-id')).rejects.toThrow('Erro ao atualizar');
    });
  });
}); 