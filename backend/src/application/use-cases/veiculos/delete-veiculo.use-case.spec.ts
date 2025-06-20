import { Test, TestingModule } from '@nestjs/testing';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { DeleteVeiculoUseCase } from './delete-veiculo.use-case';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';
import { Veiculo } from 'src/domain/entities/veiculo';

describe('DeleteVeiculoUseCase', () => {
  let useCase: DeleteVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>;

  const mockVeiculo = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
    status: { 
      getValor: () => 'em desativação',
      podeSerDesativado: () => true 
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    update: jest.fn(),
    solicitarDesativacao: jest.fn(),
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
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.update.mockResolvedValue();

      await useCase.execute('test-id');

      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockVeiculoRepository.update).toHaveBeenCalledWith(existingVeiculo);
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      mockVeiculoRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(
        'Veículo não encontrado',
      );
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando veículo não pode ser desativado', async () => {
      const existingVeiculo = {
        ...mockVeiculo,
        status: { 
          getValor: () => 'ativo',
          podeSerDesativado: () => false 
        },
        solicitarDesativacao: jest.fn(() => {
          throw new Error('Este veículo não pode ser deletado pois não está no status "em desativação"');
        })
      };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);

      await expect(useCase.execute('test-id')).rejects.toThrow(
        'Este veículo não pode ser deletado pois não está no status "em desativação"',
      );
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha ao atualizar', async () => {
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.update.mockRejectedValue(
        new Error('Erro ao atualizar'),
      );

      await expect(useCase.execute('test-id')).rejects.toThrow('Erro ao atualizar');
    });
  });
});
