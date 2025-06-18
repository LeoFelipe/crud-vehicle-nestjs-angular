import { BaseEntity } from './base-entity';
import { StatusVeiculo, StatusVeiculoValue } from '../value-objects/status-veiculo';
import { VeiculoCriadoEvent } from '../events/veiculo-criado.event';
import { VeiculoAtualizadoEvent } from '../events/veiculo-atualizado.event';
import { VeiculoDesativadoEvent } from '../events/veiculo-desativado.event';

export class Veiculo extends BaseEntity {
  constructor(
    private readonly id: string,
    private readonly placa: string,
    private readonly chassi: string,
    private readonly renavam: string,
    private readonly modelo: string,
    private readonly marca: string,
    private readonly ano: number,
    private status: StatusVeiculoValue,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {
    super();
    this.validate();
  }

  static create(
    id: string,
    placa: string,
    chassi: string,
    renavam: string,
    modelo: string,
    marca: string,
    ano: number
  ): Veiculo {
    const now = new Date();
    const veiculo = new Veiculo(
      id,
      placa,
      chassi,
      renavam,
      modelo,
      marca,
      ano,
      new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
      now,
      now
    );

    veiculo.addEvent(new VeiculoCriadoEvent(veiculo));
    return veiculo;
  }

  update(
    placa: string,
    chassi: string,
    renavam: string,
    modelo: string,
    marca: string,
    ano: number
  ): void {
    this.validateUpdateData(placa, chassi, renavam, modelo, marca, ano);
    this.updatedAt = new Date();
    this.addEvent(new VeiculoAtualizadoEvent(this));
  }

  ativar(): void {
    if (!this.status.podeSerAtivado()) {
      throw new Error('Veículo não pode ser ativado no status atual');
    }
    this.status = new StatusVeiculoValue(StatusVeiculo.ATIVO);
    this.updatedAt = new Date();
  }

  desativar(): void {
    if (!this.status.podeSerDesativado()) {
      throw new Error('Veículo não pode ser desativado no status atual');
    }
    this.status = new StatusVeiculoValue(StatusVeiculo.DESATIVADO);
    this.updatedAt = new Date();
    this.addEvent(new VeiculoDesativadoEvent(this));
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('ID do veículo é obrigatório');
    }
    if (!this.placa || this.placa.length < 6) {
      throw new Error('Placa deve ter pelo menos 6 caracteres');
    }
    if (!this.chassi || this.chassi.length !== 17) {
      throw new Error('Chassi deve ter exatamente 17 caracteres');
    }
    if (!this.renavam || this.renavam.length !== 11) {
      throw new Error('Renavam deve ter exatamente 11 dígitos');
    }
    if (!this.modelo || this.modelo.length < 2) {
      throw new Error('Modelo deve ter pelo menos 2 caracteres');
    }
    if (!this.marca || this.marca.length < 2) {
      throw new Error('Marca deve ter pelo menos 2 caracteres');
    }
    if (!this.ano || this.ano < 1900 || this.ano > new Date().getFullYear() + 1) {
      throw new Error('Ano deve ser válido');
    }
    if (new Date().getFullYear() - this.ano > 3) {
      throw new Error('Idade do veículo não pode ser maior que 3 anos');
    }
  }

  private validateUpdateData(
    placa: string,
    chassi: string,
    renavam: string,
    modelo: string,
    marca: string,
    ano: number
  ): void {
    if (!placa || placa.length < 6) {
      throw new Error('Placa deve ter pelo menos 6 caracteres');
    }
    if (!chassi || chassi.length !== 17) {
      throw new Error('Chassi deve ter exatamente 17 caracteres');
    }
    if (!renavam || renavam.length !== 11) {
      throw new Error('Renavam deve ter exatamente 11 dígitos');
    }
    if (!modelo || modelo.length < 2) {
      throw new Error('Modelo deve ter pelo menos 2 caracteres');
    }
    if (!marca || marca.length < 2) {
      throw new Error('Marca deve ter pelo menos 2 caracteres');
    }
    if (!ano || ano < 1900 || ano > new Date().getFullYear() + 1) {
      throw new Error('Ano deve ser válido');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getPlaca(): string {
    return this.placa;
  }

  getChassi(): string {
    return this.chassi;
  }

  getRenavam(): string {
    return this.renavam;
  }

  getModelo(): string {
    return this.modelo;
  }

  getMarca(): string {
    return this.marca;
  }

  getAno(): number {
    return this.ano;
  }

  getStatus(): StatusVeiculoValue {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
} 