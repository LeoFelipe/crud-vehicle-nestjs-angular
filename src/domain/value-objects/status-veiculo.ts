export enum StatusVeiculo {
  ATIVO = 'ativo',
  EM_ATIVACAO = 'em ativação',
  DESATIVADO = 'desativado'
}

export class StatusVeiculoValue {
  private readonly valor: StatusVeiculo;

  constructor(valor: StatusVeiculo) {
    this.valor = valor;
  }

  getValor(): StatusVeiculo {
    return this.valor;
  }

  estaAtivo(): boolean {
    return this.valor === StatusVeiculo.ATIVO;
  }

  estaEmAtivacao(): boolean {
    return this.valor === StatusVeiculo.EM_ATIVACAO;
  }

  estaDesativado(): boolean {
    return this.valor === StatusVeiculo.DESATIVADO;
  }

  podeSerDesativado(): boolean {
    return this.valor === StatusVeiculo.ATIVO;
  }

  podeSerAtivado(): boolean {
    return this.valor === StatusVeiculo.EM_ATIVACAO;
  }
} 