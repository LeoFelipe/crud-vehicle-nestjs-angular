import { Test, TestingModule } from '@nestjs/testing';
import { CreateVeiculoUseCase } from './create-veiculo.use-case';
import { VeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { CreateVeiculoDto } from '../../dto/create-veiculo.dto';
import { Veiculo } from '../../../domain/entities/veiculo';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('CreateVeiculoUseCase', () => {
  let useCase: CreateVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<VeiculoRepository>;

  const mockCreateVeiculoDto: CreateVeiculoDto = {
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023
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
    getUpdatedAt: jest.fn().mockReturnValue(new Date())
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVeiculoUseCase,
        {
          provide: VEICULO_REPOSITORY,
          useValue: {
            findByPlacaOrChassiOrRenavam: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateVeiculoUseCase>(CreateVeiculoUseCase);
    mockVeiculoRepository = module.get(VEICULO_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve criar um veículo com sucesso', async () => {
      // Arrange
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.save.mockResolvedValue();

      // Act
      const result = await useCase.execute(mockCreateVeiculoDto);

      // Assert
      expect(mockVeiculoRepository.findByPlacaOrChassiOrRenavam).toHaveBeenCalledWith(
        mockCreateVeiculoDto.placa,
        mockCreateVeiculoDto.chassi,
        mockCreateVeiculoDto.renavam
      );
      expect(mockVeiculoRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.placa).toBe(mockCreateVeiculoDto.placa);
      expect(result.chassi).toBe(mockCreateVeiculoDto.chassi);
      expect(result.renavam).toBe(mockCreateVeiculoDto.renavam);
      expect(result.modelo).toBe(mockCreateVeiculoDto.modelo);
      expect(result.marca).toBe(mockCreateVeiculoDto.marca);
      expect(result.ano).toBe(mockCreateVeiculoDto.ano);
      expect(result.status).toBe('em ativação');
    });

    it('deve lançar erro quando já existe veículo com a mesma placa', async () => {
      // Arrange
      const existingVeiculo = {
        ...mockVeiculo,
        getPlaca: jest.fn().mockReturnValue('ABC1234'),
        getChassi: jest.fn().mockReturnValue('98765432109876543'),
        getRenavam: jest.fn().mockReturnValue('98765432109')
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([existingVeiculo as any]);

      // Act & Assert
      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): placa'
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe veículo com o mesmo chassi', async () => {
      // Arrange
      const existingVeiculo = {
        ...mockVeiculo,
        getPlaca: jest.fn().mockReturnValue('XYZ5678'),
        getChassi: jest.fn().mockReturnValue('12345678901234567'),
        getRenavam: jest.fn().mockReturnValue('98765432109')
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([existingVeiculo as any]);

      // Act & Assert
      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): chassi'
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe veículo com o mesmo renavam', async () => {
      // Arrange
      const existingVeiculo = {
        ...mockVeiculo,
        getPlaca: jest.fn().mockReturnValue('XYZ5678'),
        getChassi: jest.fn().mockReturnValue('98765432109876543'),
        getRenavam: jest.fn().mockReturnValue('12345678901')
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([existingVeiculo as any]);

      // Act & Assert
      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): renavam'
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existem múltiplos conflitos', async () => {
      // Arrange
      const existingVeiculo1 = {
        ...mockVeiculo,
        getPlaca: jest.fn().mockReturnValue('ABC1234'),
        getChassi: jest.fn().mockReturnValue('98765432109876543'),
        getRenavam: jest.fn().mockReturnValue('98765432109')
      };

      const existingVeiculo2 = {
        ...mockVeiculo,
        getPlaca: jest.fn().mockReturnValue('XYZ5678'),
        getChassi: jest.fn().mockReturnValue('12345678901234567'),
        getRenavam: jest.fn().mockReturnValue('11111111111')
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        existingVeiculo1 as any,
        existingVeiculo2 as any
      ]);

      // Act & Assert
      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): placa, chassi'
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha ao salvar', async () => {
      // Arrange
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.save.mockRejectedValue(new Error('Erro ao salvar'));

      // Act & Assert
      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow('Erro ao salvar');
    });
  });
}); 