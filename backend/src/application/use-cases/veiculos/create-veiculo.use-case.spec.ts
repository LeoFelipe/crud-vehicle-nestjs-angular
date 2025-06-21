import { Test, TestingModule } from '@nestjs/testing';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { CreateVeiculoUseCase } from './create-veiculo.use-case';
import { CreateVeiculoRequestDto } from '../../../presentation/requests/create-veiculo-request.dto';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('CreateVeiculoUseCase', () => {
  let useCase: CreateVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>;

  const mockCreateVeiculoDto: CreateVeiculoRequestDto = {
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
  };

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
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.save.mockResolvedValue();

      const result = await useCase.execute(mockCreateVeiculoDto);

      expect(mockVeiculoRepository.findByPlacaOrChassiOrRenavam).toHaveBeenCalledWith(
        mockCreateVeiculoDto.placa,
        mockCreateVeiculoDto.chassi,
        mockCreateVeiculoDto.renavam,
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

    it('deve lançar erro quando já existe um veículo com a mesma placa', async () => {
      const conflictingVeiculo = {
        ...mockVeiculo,
        id: 'other-id',
        placa: 'ABC1234',
        chassi: '11111111111111111',
        renavam: '11111111111',
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        conflictingVeiculo as any,
      ]);

      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): placa',
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe um veículo com o mesmo chassi', async () => {
      const conflictingVeiculo = {
        ...mockVeiculo,
        id: 'other-id',
        placa: 'XYZ9999',
        chassi: '12345678901234567',
        renavam: '11111111111',
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        conflictingVeiculo as any,
      ]);

      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): chassi',
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe um veículo com o mesmo renavam', async () => {
      const conflictingVeiculo = {
        ...mockVeiculo,
        id: 'other-id',
        placa: 'XYZ9999',
        chassi: '11111111111111111',
        renavam: '12345678901',
      };

      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        conflictingVeiculo as any,
      ]);

      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Já existe um veículo com este(s) campo(s): renavam',
      );
      expect(mockVeiculoRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório falha ao criar', async () => {
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.save.mockRejectedValue(
        new Error('Erro ao criar veículo'),
      );

      await expect(useCase.execute(mockCreateVeiculoDto)).rejects.toThrow(
        'Erro ao criar veículo',
      );
    });
  });
}); 