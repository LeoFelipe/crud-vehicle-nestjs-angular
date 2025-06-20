import { BaseEntity } from '../entities/base-entity';
import {
  StatusVeiculo,
  StatusVeiculoValue,
} from '../value-objects/status-veiculo';
import { VeiculoCriadoEvent } from '../events/veiculo-criado.event';
import { VeiculoAtualizadoEvent } from '../events/veiculo-atualizado.event';
import { VeiculoEmDesativacaoEvent } from '../events/veiculo-em-desativacao.event';

interface VeiculoProps {
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
  status: StatusVeiculoValue;
  createdAt: Date;
  updatedAt: Date;
}

export class Veiculo extends BaseEntity<VeiculoProps> {
  constructor(
    props: VeiculoProps,
    id?: string,
  ) {
    super(props, id);
    this.validate();
  }

  get placa(): string {
    return this.props.placa;
  }

  get chassi(): string {
    return this.props.chassi;
  }

  get renavam(): string {
    return this.props.renavam;
  }

  get modelo(): string {
    return this.props.modelo;
  }

  get marca(): string {
    return this.props.marca;
  }

  get ano(): number {
    return this.props.ano;
  }

  get status(): StatusVeiculoValue {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  public static create(
    props: Omit<VeiculoProps, 'status' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ): Veiculo {
    const now = new Date();
    const veiculoProps: VeiculoProps = {
      ...props,
      status: new StatusVeiculoValue(StatusVeiculo.EM_ATIVACAO),
      createdAt: now,
      updatedAt: now,
    };
    const veiculo = new Veiculo(veiculoProps, id);
    veiculo.addEvent(new VeiculoCriadoEvent(veiculo.id));
    return veiculo;
  }

  public update(props: Partial<Omit<VeiculoProps, 'status' | 'createdAt' | 'updatedAt'>>): void {
    Object.assign(this.props, props);
    this.props.updatedAt = new Date();
    this.validate();
    this.addEvent(new VeiculoAtualizadoEvent(this.id));
  }

  public solicitarDesativacao(): void {
    if (!this.props.status.estaAtivo()) {
      throw new Error('Veículo só pode ser colocado em desativação se estiver ATIVO');
    }
    this.props.status = new StatusVeiculoValue(StatusVeiculo.EM_DESATIVACAO);
    this.props.updatedAt = new Date();
    this.addEvent(new VeiculoEmDesativacaoEvent(this.id));
  }

  public desativar(): void {
    if (!this.props.status.podeSerDesativado()) {
      throw new Error('Veículo só pode ser desativado se estiver EM_DESATIVACAO');
    }
    this.props.status = new StatusVeiculoValue(StatusVeiculo.DESATIVADO);
    this.props.updatedAt = new Date();
  }

  public ativar(): void {
    if (!this.props.status.podeSerAtivado()) {
      throw new Error('Veículo não pode ser ativado no status atual');
    }
    this.props.status = new StatusVeiculoValue(StatusVeiculo.ATIVO);
    this.props.updatedAt = new Date();
  }

  private validate(): void {
    if (!this.props.placa || this.props.placa.length < 6) {
      throw new Error('Placa deve ter pelo menos 6 caracteres');
    }
    if (!this.props.chassi || this.props.chassi.length !== 17) {
      throw new Error('Chassi deve ter exatamente 17 caracteres');
    }
    if (!this.props.renavam || this.props.renavam.length !== 11) {
      throw new Error('Renavam deve ter exatamente 11 dígitos');
    }
    if (!this.props.modelo || this.props.modelo.length < 2) {
      throw new Error('Modelo deve ter pelo menos 2 caracteres');
    }
    if (!this.props.marca || this.props.marca.length < 2) {
      throw new Error('Marca deve ter pelo menos 2 caracteres');
    }
    if (
      !this.props.ano ||
      this.props.ano < 1900 ||
      this.props.ano > new Date().getFullYear() + 1
    ) {
      throw new Error('Ano deve ser válido');
    }
    if (new Date().getFullYear() - this.props.ano > 3) {
      throw new Error('Idade do veículo não pode ser maior que 3 anos');
    }
  }
}
