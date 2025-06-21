import { Test, TestingModule } from '@nestjs/testing';
import { IVeiculoRepository } from '../../../domain/repositories/veiculo-repository.interface';
import { UpdateVeiculoUseCase } from './update-veiculo.use-case';
import { UpdateVeiculoRequestDto } from '../../../presentation/requests/update-veiculo-request.dto';
import { VEICULO_REPOSITORY } from '../../../infrastructure/config/injection-tokens';

describe('UpdateVeiculoUseCase', () => {
  let useCase: UpdateVeiculoUseCase;
  let mockVeiculoRepository: jest.Mocked<IVeiculoRepository>;

  const mockUpdateVeiculoDto: UpdateVeiculoRequestDto = {
    placa: 'XYZ5678',
    chassi: '98765432109876543',
    renavam: '98765432109',
    modelo: 'Corolla',
    marca: 'Toyota',
    ano: 2024,
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
    update: jest.fn(),
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
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.update.mockResolvedValue();

      const result = await useCase.execute('test-id', mockUpdateVeiculoDto);

      expect(mockVeiculoRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockVeiculoRepository.findByPlacaOrChassiOrRenavam).toHaveBeenCalledWith(
        mockUpdateVeiculoDto.placa,
        mockUpdateVeiculoDto.chassi,
        mockUpdateVeiculoDto.renavam,
      );
      expect(existingVeiculo.update).toHaveBeenCalledWith({
        placa: mockUpdateVeiculoDto.placa,
        chassi: mockUpdateVeiculoDto.chassi,
        renavam: mockUpdateVeiculoDto.renavam,
        modelo: mockUpdateVeiculoDto.modelo,
        marca: mockUpdateVeiculoDto.marca,
        ano: mockUpdateVeiculoDto.ano,
      });
      expect(mockVeiculoRepository.update).toHaveBeenCalledWith(existingVeiculo);
      expect(result).toHaveProperty('id', 'test-id');
    });

    it('deve lançar erro quando veículo não é encontrado', async () => {
      mockVeiculoRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute('non-existent-id', mockUpdateVeiculoDto),
      ).rejects.toThrow('Veículo não encontrado');
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe outro veículo com a mesma placa', async () => {
      const existingVeiculo = { ...mockVeiculo };
      const conflictingVeiculo = {
        ...mockVeiculo,
        id: 'other-id',
        placa: 'XYZ5678',
        chassi: '11111111111111111',
        renavam: '11111111111',
      };

      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        conflictingVeiculo as any,
      ]);

      await expect(
        useCase.execute('test-id', mockUpdateVeiculoDto),
      ).rejects.toThrow('Já existe um veículo com este(s) campo(s): placa');
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando já existe outro veículo com o mesmo chassi', async () => {
      const existingVeiculo = { ...mockVeiculo };
      const conflictingVeiculo = {
        ...mockVeiculo,
        id: 'other-id',
        placa: 'ABC9999',
        chassi: '98765432109876543',
        renavam: '11111111111',
      };

      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        conflictingVeiculo as any,
      ]);

      await expect(
        useCase.execute('test-id', mockUpdateVeiculoDto),
      ).rejects.toThrow('Já existe um veículo com este(s) campo(s): chassi');
      expect(mockVeiculoRepository.update).not.toHaveBeenCalled();
    });

    it('deve ignorar o próprio veículo ao verificar conflitos', async () => {
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([
        existingVeiculo as any,
      ]);
      mockVeiculoRepository.update.mockResolvedValue();

      const result = await useCase.execute('test-id', mockUpdateVeiculoDto);

      expect(mockVeiculoRepository.update).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'test-id');
    });

    it('deve lançar erro quando o repositório falha ao atualizar', async () => {
      const existingVeiculo = { ...mockVeiculo };
      mockVeiculoRepository.findById.mockResolvedValue(existingVeiculo as any);
      mockVeiculoRepository.findByPlacaOrChassiOrRenavam.mockResolvedValue([]);
      mockVeiculoRepository.update.mockRejectedValue(
        new Error('Erro ao atualizar'),
      );

      await expect(
        useCase.execute('test-id', mockUpdateVeiculoDto),
      ).rejects.toThrow('Erro ao atualizar');
    });
  });
});
