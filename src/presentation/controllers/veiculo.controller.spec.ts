import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { VeiculoController } from './veiculo.controller';
import { CreateVeiculoUseCase } from '../../application/use-cases/veiculos/create-veiculo.use-case';
import { UpdateVeiculoUseCase } from '../../application/use-cases/veiculos/update-veiculo.use-case';
import { DeleteVeiculoUseCase } from '../../application/use-cases/veiculos/delete-veiculo.use-case';
import { GetVeiculosUseCase } from '../../application/use-cases/veiculos/get-veiculos.use-case';
import { GetVeiculoByIdUseCase } from '../../application/use-cases/veiculos/get-veiculo-by-id.use-case';
import { CreateVeiculoDto } from '../../application/dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../../application/dto/update-veiculo.dto';
import { VeiculoResponseDto } from '../../application/dto/veiculo-response.dto';

describe('VeiculoController (e2e)', () => {
  let app: INestApplication;
  let createVeiculoUseCase: jest.Mocked<CreateVeiculoUseCase>;
  let updateVeiculoUseCase: jest.Mocked<UpdateVeiculoUseCase>;
  let deleteVeiculoUseCase: jest.Mocked<DeleteVeiculoUseCase>;
  let getVeiculosUseCase: jest.Mocked<GetVeiculosUseCase>;
  let getVeiculoByIdUseCase: jest.Mocked<GetVeiculoByIdUseCase>;

  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  
  const mockVeiculoResponse: VeiculoResponseDto = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
    status: 'ativo',
    createdAt: mockDate,
    updatedAt: mockDate
  };

  const validCreateDto: CreateVeiculoDto = {
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023
  };

  const validUpdateDto: UpdateVeiculoDto = {
    placa: 'XYZ5678',
    chassi: '98765432109876543',
    renavam: '98765432109',
    modelo: 'Corolla',
    marca: 'Toyota',
    ano: 2024
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [VeiculoController],
      providers: [
        {
          provide: CreateVeiculoUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateVeiculoUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteVeiculoUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetVeiculosUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetVeiculoByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    }));

    createVeiculoUseCase = moduleFixture.get(CreateVeiculoUseCase);
    updateVeiculoUseCase = moduleFixture.get(UpdateVeiculoUseCase);
    deleteVeiculoUseCase = moduleFixture.get(DeleteVeiculoUseCase);
    getVeiculosUseCase = moduleFixture.get(GetVeiculosUseCase);
    getVeiculoByIdUseCase = moduleFixture.get(GetVeiculoByIdUseCase);

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /veiculos', () => {
    it('deve criar um veículo com sucesso e retornar 201', async () => {
      // Arrange
      createVeiculoUseCase.execute.mockResolvedValue(mockVeiculoResponse);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/veiculos')
        .send(validCreateDto)
        .expect(201);

      // Verificar se as datas são serializadas como strings
      expect(response.body.id).toBe(mockVeiculoResponse.id);
      expect(response.body.placa).toBe(mockVeiculoResponse.placa);
      expect(response.body.chassi).toBe(mockVeiculoResponse.chassi);
      expect(response.body.renavam).toBe(mockVeiculoResponse.renavam);
      expect(response.body.modelo).toBe(mockVeiculoResponse.modelo);
      expect(response.body.marca).toBe(mockVeiculoResponse.marca);
      expect(response.body.ano).toBe(mockVeiculoResponse.ano);
      expect(response.body.status).toBe(mockVeiculoResponse.status);
      expect(response.body.createdAt).toBe(mockDate.toISOString());
      expect(response.body.updatedAt).toBe(mockDate.toISOString());
      
      expect(createVeiculoUseCase.execute).toHaveBeenCalledWith(validCreateDto);
    });

    it('deve retornar 400 quando dados são inválidos', async () => {
      // Arrange
      const invalidDto = {
        placa: 'ABC', // Muito curta
        chassi: '123', // Muito curto
        renavam: '123', // Muito curto
        modelo: 'A', // Muito curto
        marca: 'H', // Muito curto
        ano: 1800 // Inválido
      };

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/veiculos')
        .send(invalidDto)
        .expect(400);

      // Verificar se as mensagens de erro contêm os campos esperados
      const errorMessages = response.body.message;
      expect(Array.isArray(errorMessages)).toBe(true);
      expect(errorMessages.some(msg => msg.includes('placa'))).toBe(true);
      expect(errorMessages.some(msg => msg.includes('chassi'))).toBe(true);
      expect(errorMessages.some(msg => msg.includes('renavam'))).toBe(true);
      expect(errorMessages.some(msg => msg.includes('modelo'))).toBe(true);
      expect(errorMessages.some(msg => msg.includes('marca'))).toBe(true);
      expect(errorMessages.some(msg => msg.includes('ano'))).toBe(true);
      expect(createVeiculoUseCase.execute).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
      // Arrange
      const incompleteDto = {
        placa: 'ABC1234'
        // Faltando outros campos
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/veiculos')
        .send(incompleteDto)
        .expect(400);

      expect(createVeiculoUseCase.execute).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando use case falha', async () => {
      // Arrange
      createVeiculoUseCase.execute.mockRejectedValue(new Error('Erro interno'));

      // Act & Assert
      await request(app.getHttpServer())
        .post('/veiculos')
        .send(validCreateDto)
        .expect(500);
    });
  });

  describe('GET /veiculos', () => {
    it('deve retornar lista de veículos com status 200', async () => {
      // Arrange
      const veiculosList = [mockVeiculoResponse];
      getVeiculosUseCase.execute.mockResolvedValue(veiculosList);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/veiculos')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(mockVeiculoResponse.id);
      expect(response.body[0].placa).toBe(mockVeiculoResponse.placa);
      expect(response.body[0].createdAt).toBe(mockDate.toISOString());
      expect(response.body[0].updatedAt).toBe(mockDate.toISOString());
      expect(getVeiculosUseCase.execute).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há veículos', async () => {
      // Arrange
      getVeiculosUseCase.execute.mockResolvedValue([]);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/veiculos')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /veiculos/:id', () => {
    it('deve retornar veículo específico com status 200', async () => {
      // Arrange
      getVeiculoByIdUseCase.execute.mockResolvedValue(mockVeiculoResponse);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/veiculos/test-id')
        .expect(200);

      expect(response.body.id).toBe(mockVeiculoResponse.id);
      expect(response.body.placa).toBe(mockVeiculoResponse.placa);
      expect(response.body.createdAt).toBe(mockDate.toISOString());
      expect(response.body.updatedAt).toBe(mockDate.toISOString());
      expect(getVeiculoByIdUseCase.execute).toHaveBeenCalledWith('test-id');
    });

    it('deve retornar 500 quando veículo não é encontrado', async () => {
      // Arrange
      getVeiculoByIdUseCase.execute.mockRejectedValue(new Error('Veículo não encontrado'));

      // Act & Assert
      await request(app.getHttpServer())
        .get('/veiculos/not-found')
        .expect(500);
    });
  });

  describe('PUT /veiculos/:id', () => {
    it('deve atualizar veículo com sucesso e retornar 200', async () => {
      // Arrange
      const updatedVeiculo = { ...mockVeiculoResponse, ...validUpdateDto };
      updateVeiculoUseCase.execute.mockResolvedValue(updatedVeiculo);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .put('/veiculos/test-id')
        .send(validUpdateDto)
        .expect(200);

      expect(response.body.id).toBe(updatedVeiculo.id);
      expect(response.body.placa).toBe(validUpdateDto.placa);
      expect(response.body.chassi).toBe(validUpdateDto.chassi);
      expect(response.body.renavam).toBe(validUpdateDto.renavam);
      expect(response.body.modelo).toBe(validUpdateDto.modelo);
      expect(response.body.marca).toBe(validUpdateDto.marca);
      expect(response.body.ano).toBe(validUpdateDto.ano);
      expect(response.body.createdAt).toBe(mockDate.toISOString());
      expect(response.body.updatedAt).toBe(mockDate.toISOString());
      expect(updateVeiculoUseCase.execute).toHaveBeenCalledWith('test-id', validUpdateDto);
    });

    it('deve retornar 400 quando dados de atualização são inválidos', async () => {
      // Arrange
      const invalidUpdateDto = {
        placa: 'ABC', // Muito curta
        chassi: '12345678901234567',
        renavam: '12345678901',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2023
      };

      // Act & Assert
      await request(app.getHttpServer())
        .put('/veiculos/test-id')
        .send(invalidUpdateDto)
        .expect(400);

      expect(updateVeiculoUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /veiculos/:id', () => {
    it('deve deletar veículo com sucesso e retornar 204', async () => {
      // Arrange
      deleteVeiculoUseCase.execute.mockResolvedValue();

      // Act & Assert
      await request(app.getHttpServer())
        .delete('/veiculos/test-id')
        .expect(204);

      expect(deleteVeiculoUseCase.execute).toHaveBeenCalledWith('test-id');
    });

    it('deve retornar 500 quando veículo não é encontrado para deletar', async () => {
      // Arrange
      deleteVeiculoUseCase.execute.mockRejectedValue(new Error('Veículo não encontrado'));

      // Act & Assert
      await request(app.getHttpServer())
        .delete('/veiculos/not-found')
        .expect(500);
    });
  });
}); 