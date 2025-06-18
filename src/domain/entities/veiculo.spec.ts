import { Veiculo } from './veiculo';
import { StatusVeiculo, StatusVeiculoValue } from '../value-objects/status-veiculo';

describe('Veiculo', () => {
  const validVeiculoData = {
    id: 'test-id',
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023
  };

  describe('create', () => {
    it('deve criar um veículo com sucesso', () => {
      // Act
      const veiculo = Veiculo.create(
        validVeiculoData.id,
        validVeiculoData.placa,
        validVeiculoData.chassi,
        validVeiculoData.renavam,
        validVeiculoData.modelo,
        validVeiculoData.marca,
        validVeiculoData.ano
      );

      // Assert
      expect(veiculo.getId()).toBe(validVeiculoData.id);
      expect(veiculo.getPlaca()).toBe(validVeiculoData.placa);
      expect(veiculo.getChassi()).toBe(validVeiculoData.chassi);
      expect(veiculo.getRenavam()).toBe(validVeiculoData.renavam);
      expect(veiculo.getModelo()).toBe(validVeiculoData.modelo);
      expect(veiculo.getMarca()).toBe(validVeiculoData.marca);
      expect(veiculo.getAno()).toBe(validVeiculoData.ano);
      expect(veiculo.getStatus().getValor()).toBe(StatusVeiculo.EM_ATIVACAO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].eventName).toBe('VeiculoCriado');
    });

    it('deve lançar erro quando ID é vazio', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          '',
          validVeiculoData.placa,
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          validVeiculoData.marca,
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('ID do veículo é obrigatório');
    });

    it('deve lançar erro quando placa é muito curta', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          'ABC',
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          validVeiculoData.marca,
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Placa deve ter pelo menos 6 caracteres');
    });

    it('deve lançar erro quando chassi não tem 17 caracteres', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          validVeiculoData.placa,
          '123456789',
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          validVeiculoData.marca,
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Chassi deve ter exatamente 17 caracteres');
    });

    it('deve lançar erro quando renavam não tem 11 dígitos', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          validVeiculoData.placa,
          validVeiculoData.chassi,
          '123456',
          validVeiculoData.modelo,
          validVeiculoData.marca,
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Renavam deve ter exatamente 11 dígitos');
    });

    it('deve lançar erro quando modelo é muito curto', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          validVeiculoData.placa,
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          'A',
          validVeiculoData.marca,
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Modelo deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro quando marca é muito curta', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          validVeiculoData.placa,
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          'H',
          validVeiculoData.ano,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Marca deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro quando ano é inválido', () => {
      // Act & Assert
      expect(() => {
        new Veiculo(
          validVeiculoData.id,
          validVeiculoData.placa,
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          validVeiculoData.marca,
          1800,
          new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
          new Date(),
          new Date()
        );
      }).toThrow('Ano deve ser válido');
    });
  });

  describe('update', () => {
    let veiculo: Veiculo;

    beforeEach(() => {
      veiculo = Veiculo.create(
        validVeiculoData.id,
        validVeiculoData.placa,
        validVeiculoData.chassi,
        validVeiculoData.renavam,
        validVeiculoData.modelo,
        validVeiculoData.marca,
        validVeiculoData.ano
      );
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
        ano: 2024
      };

      // Act
      veiculo.update(
        updateData.placa,
        updateData.chassi,
        updateData.renavam,
        updateData.modelo,
        updateData.marca,
        updateData.ano
      );

      // Assert
      expect(veiculo.getStatus().getValor()).toBe(StatusVeiculo.EM_ATIVACAO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].eventName).toBe('VeiculoAtualizado');
    });

    it('deve lançar erro quando placa é inválida na atualização', () => {
      // Act & Assert
      expect(() => {
        veiculo.update(
          'ABC',
          validVeiculoData.chassi,
          validVeiculoData.renavam,
          validVeiculoData.modelo,
          validVeiculoData.marca,
          validVeiculoData.ano
        );
      }).toThrow('Placa deve ter pelo menos 6 caracteres');
    });
  });

  describe('desativar', () => {
    let veiculo: Veiculo;

    beforeEach(() => {
      veiculo = Veiculo.create(
        validVeiculoData.id,
        validVeiculoData.placa,
        validVeiculoData.chassi,
        validVeiculoData.renavam,
        validVeiculoData.modelo,
        validVeiculoData.marca,
        validVeiculoData.ano
      );
      veiculo.ativar();
      veiculo.clearEvents(); // Limpar eventos de criação
    });

    it('deve desativar um veículo com sucesso', () => {
      // Act
      veiculo.desativar();

      // Assert
      expect(veiculo.getStatus().getValor()).toBe(StatusVeiculo.DESATIVADO);
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);
      expect(veiculo.events[0].eventName).toBe('VeiculoDesativado');
    });

    it('deve lançar erro quando veículo já está desativado', () => {
      // Arrange
      veiculo.desativar();
      veiculo.clearEvents();

      // Act & Assert
      expect(() => {
        veiculo.desativar();
      }).toThrow('Veículo não pode ser desativado no status atual');
    });
  });

  describe('events', () => {
    it('deve gerenciar eventos corretamente', () => {
      // Arrange
      const veiculo = Veiculo.create(
        validVeiculoData.id,
        validVeiculoData.placa,
        validVeiculoData.chassi,
        validVeiculoData.renavam,
        validVeiculoData.modelo,
        validVeiculoData.marca,
        validVeiculoData.ano
      );

      // Assert
      expect(veiculo.hasEvents()).toBe(true);
      expect(veiculo.events).toHaveLength(1);

      // Act
      veiculo.clearEvents();

      // Assert
      expect(veiculo.hasEvents()).toBe(false);
      expect(veiculo.events).toHaveLength(0);
    });
  });
}); 