import { Veiculo } from './veiculo';
import {
  StatusVeiculo,
  StatusVeiculoValue,
} from '../value-objects/status-veiculo';

describe('Veiculo', () => {
  const validVeiculoData = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
  };

  describe('create', () => {
    it('deve criar um veículo com sucesso', () => {
      // Act
      const veiculo = Veiculo.create({
        placa: validVeiculoData.placa,
        chassi: validVeiculoData.chassi,
        renavam: validVeiculoData.renavam,
        modelo: validVeiculoData.modelo,
        marca: validVeiculoData.marca,
        ano: validVeiculoData.ano,
      }, validVeiculoData.id);

      // Assert
      expect(veiculo.id).toBe(validVeiculoData.id);
      expect(veiculo.placa).toBe(validVeiculoData.placa);
      expect(veiculo.chassi).toBe(validVeiculoData.chassi);
      expect(veiculo.renavam).toBe(validVeiculoData.renavam);
      expect(veiculo.modelo).toBe(validVeiculoData.modelo);
      expect(veiculo.marca).toBe(validVeiculoData.marca);
      expect(veiculo.ano).toBe(validVeiculoData.ano);
      expect(veiculo.status.getValor()).toBe(StatusVeiculo.EM_ATIVACAO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].constructor.name).toBe('VeiculoCriadoEvent');
    });

    it('deve lançar erro quando placa é muito curta', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: 'ABC',
          chassi: validVeiculoData.chassi,
          renavam: validVeiculoData.renavam,
          modelo: validVeiculoData.modelo,
          marca: validVeiculoData.marca,
          ano: validVeiculoData.ano,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Placa deve ter pelo menos 6 caracteres');
    });

    it('deve lançar erro quando chassi não tem 17 caracteres', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: validVeiculoData.placa,
          chassi: '123456789',
          renavam: validVeiculoData.renavam,
          modelo: validVeiculoData.modelo,
          marca: validVeiculoData.marca,
          ano: validVeiculoData.ano,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Chassi deve ter exatamente 17 caracteres');
    });

    it('deve lançar erro quando renavam não tem 11 dígitos', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: validVeiculoData.placa,
          chassi: validVeiculoData.chassi,
          renavam: '123456',
          modelo: validVeiculoData.modelo,
          marca: validVeiculoData.marca,
          ano: validVeiculoData.ano,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Renavam deve ter exatamente 11 dígitos');
    });

    it('deve lançar erro quando modelo é muito curto', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: validVeiculoData.placa,
          chassi: validVeiculoData.chassi,
          renavam: validVeiculoData.renavam,
          modelo: 'A',
          marca: validVeiculoData.marca,
          ano: validVeiculoData.ano,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Modelo deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro quando marca é muito curta', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: validVeiculoData.placa,
          chassi: validVeiculoData.chassi,
          renavam: validVeiculoData.renavam,
          modelo: validVeiculoData.modelo,
          marca: 'H',
          ano: validVeiculoData.ano,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Marca deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro quando ano é inválido', () => {
      // Act & Assert
      expect(() => {
        new Veiculo({
          placa: validVeiculoData.placa,
          chassi: validVeiculoData.chassi,
          renavam: validVeiculoData.renavam,
          modelo: validVeiculoData.modelo,
          marca: validVeiculoData.marca,
          ano: 1800,
          status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, validVeiculoData.id);
      }).toThrow('Ano deve ser válido');
    });
  });

  describe('update', () => {
    let veiculo: Veiculo;

    beforeEach(() => {
      veiculo = Veiculo.create({
        placa: validVeiculoData.placa,
        chassi: validVeiculoData.chassi,
        renavam: validVeiculoData.renavam,
        modelo: validVeiculoData.modelo,
        marca: validVeiculoData.marca,
        ano: validVeiculoData.ano,
      }, validVeiculoData.id);
      veiculo.clearEvents(); // Limpar eventos de criação
    });

    it('deve atualizar um veículo com sucesso', () => {
      // Arrange
      const updateData = {
        placa: 'XYZ5678',
        chassi: '98765432109876543',
        renavam: '98765432109',
        modelo: 'Corolla',
        marca: 'Toyota',
        ano: 2024,
      };

      // Act
      veiculo.update(updateData);

      // Assert
      expect(veiculo.placa).toBe(updateData.placa);
      expect(veiculo.chassi).toBe(updateData.chassi);
      expect(veiculo.renavam).toBe(updateData.renavam);
      expect(veiculo.modelo).toBe(updateData.modelo);
      expect(veiculo.marca).toBe(updateData.marca);
      expect(veiculo.ano).toBe(updateData.ano);
      expect(veiculo.status.getValor()).toBe(StatusVeiculo.EM_ATIVACAO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].constructor.name).toBe('VeiculoAtualizadoEvent');
    });
  });

  describe('solicitarDesativacao', () => {
    let veiculo: Veiculo;

    beforeEach(() => {
      veiculo = Veiculo.create({
        placa: validVeiculoData.placa,
        chassi: validVeiculoData.chassi,
        renavam: validVeiculoData.renavam,
        modelo: validVeiculoData.modelo,
        marca: validVeiculoData.marca,
        ano: validVeiculoData.ano,
      }, validVeiculoData.id);
      veiculo.ativar(); // Ativar antes de solicitar desativação
      veiculo.clearEvents(); // Limpar eventos de criação
    });

    it('deve solicitar desativação com sucesso', () => {
      // Act
      veiculo.solicitarDesativacao();

      // Assert
      expect(veiculo.status.getValor()).toBe(StatusVeiculo.EM_DESATIVACAO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].constructor.name).toBe('VeiculoEmDesativacaoEvent');
    });

    it('deve desativar veículo quando já está em desativação', () => {
      // Arrange
      veiculo.solicitarDesativacao();
      veiculo.clearEvents();

      // Act
      veiculo.desativar();

      // Assert
      expect(veiculo.status.getValor()).toBe(StatusVeiculo.DESATIVADO);
    });
  });

  describe('status', () => {
    let veiculo: Veiculo;

    beforeEach(() => {
      veiculo = Veiculo.create({
        placa: validVeiculoData.placa,
        chassi: validVeiculoData.chassi,
        renavam: validVeiculoData.renavam,
        modelo: validVeiculoData.modelo,
        marca: validVeiculoData.marca,
        ano: validVeiculoData.ano,
      }, validVeiculoData.id);
    });

    it('deve retornar status correto após solicitar desativação', () => {
      // Act
      veiculo.ativar();
      veiculo.solicitarDesativacao();

      // Assert
      expect(veiculo.status.estaEmDesativacao()).toBe(true);
    });

    it('deve criar veículo com status em ativação por padrão', () => {
      // Act
      const novoVeiculo = Veiculo.create({
        placa: 'XYZ5678',
        chassi: '98765432109876543',
        renavam: '98765432109',
        modelo: 'Corolla',
        marca: 'Toyota',
        ano: 2024,
      }, 'new-id');

      // Assert
      expect(novoVeiculo.status.getValor()).toBe(StatusVeiculo.EM_ATIVACAO);
    });
  });
});
