import { Test, TestingModule } from '@nestjs/testing';
import { UpdateVeiculoUseCase } from './update-veiculo.use-case';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { UpdateVeiculoDto } from '../../dto/update-veiculo.dto';
import { Veiculo } from '../../../domain/entities/veiculo';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('UpdateVeiculoUseCase', () => {
  let useCase: UpdateVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<VeiculoRepository>;

  const mockUpdateVeiculoDto: UpdateVeiculoDto = {
    placa: 'XYZ5678',
    chassi: '98765432109876543',
    renavam: '98765432109',
    modelo: 'Corolla',
    marca: 'Toyota',
    ano: 2024
  };

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
    getUpdatedAt: jest.fn().mockReturnValue(new Date()),
    update: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVeiculoUseCase,
        {
          provide: VEICULO_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByPlacaOrChassiOrRenavam: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateVeiculoUseCase>(UpdateVeiculoUseCase);
    mockVeiculoRepository = module.get(VEICULO_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve atualizar um veículo com sucesso', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.update.mockResolvedValue();

      // Act
      const result = await useCase.execute('test-id', mockUpdateVeiculoDto);

      // Assert
      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockVeiculoRepository.findByPlacaOrChassiOrRenavam).toHaveBeenCalledWith(
        mockUpdateVeiculoDto.placa,
        mockUpdateVeiculoDto.chassi,
        mockUpdateVeiculoDto.renavam
      );
      expect(existingVeiculo.update).toHaveBeenCalledWith(
        mockUpdateVeiculoDto.placa,
        mockUpdateVeiculoDto.chassi,
        mockUpdateVeiculoDto.renavam,
        mockUpdateVeiculoDto.modelo,
        mockUpdateVeiculoDto.marca,
        mockUpdateVeiculoDto.ano
      );
      expect(mockVeiculoRepository.update).toHaveBeenCalledWith(existingVeiculo);
      expect(result).toHaveProperty('id', 'test-id');
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      // Arrange
      mockVeiculoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-id', mockUpdateVeiculoDto)).rejects.toThrow(
        'Veículo não encontrado'
      );
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe outro veículo com a mesma placa', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      const conflictingVeiculo = {
        ...mockVeiculo,
        getId: jest.fn().mockReturnValue('other-id'),
        getPlaca: jest.fn().mockReturnValue('XYZ5678'),
        getChassi: jest.fn().mockReturnValue('11111111111111111'),
        getRenavam: jest.fn().mockReturnValue('11111111111')
      };

      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([conflictingVeiculo as any]);

      // Act & Assert
      await expect(useCase.execute('test-id', mockUpdateVeiculoDto)).rejects.toThrow(
        'Já existe outro veículo com este(s) campo(s): placa'
      );
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe outro veículo com o mesmo chassi', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      const conflictingVeiculo = {
        ...mockVeiculo,
        getId: jest.fn().mockReturnValue('other-id'),
        getPlaca: jest.fn().mockReturnValue('ABC9999'),
        getChassi: jest.fn().mockReturnValue('98765432109876543'),
        getRenavam: jest.fn().mockReturnValue('11111111111')
      };

      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([conflictingVeiculo as any]);

      // Act & Assert
      await expect(useCase.execute('test-id', mockUpdateVeiculoDto)).rejects.toThrow(
        'Já existe outro veículo com este(s) campo(s): chassi'
      );
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve ignorar o próprio veículo ao verificar conflitos', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([existingVeiculo as any]);
      mockVeiculoRepository.update.mockResolvedValue();

      // Act
      const result = await useCase.execute('test-id', mockUpdateVeiculoDto);

      // Assert
      expect(mockVeiculoRepository.update).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'test-id');
    });

    it('deve lançar erro quando o repositório falha ao atualizar', async () => {
      // Arrange
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.update.mockRejectedValue(new Error('Erro ao atualizar'));

      // Act & Assert
      await expect(useCase.execute('test-id', mockUpdateVeiculoDto)).rejects.toThrow('Erro ao atualizar');
    });
  });
}); 