import { Injectable, Logger, Inject } from '@nestjs/common';
import prisma from './prisma-client';
import { IVeiculoRepository } from '../../domain/repositories/veiculo-repository.interface';
import { Veiculo } from '../../domain/entities/veiculo';
import { BaseRepository } from './base-repository';
import { IEventBus } from '../../application/event-bus/event-bus.interface';
import { StatusVeiculoValue } from '../../domain/value-objects/status-veiculo';
import { EVENT_BUS } from '../config/injection-tokens';

@Injectable()
export class VeiculoRepositoryImpl
  extends BaseRepository
  implements IVeiculoRepository
{
  private readonly logger = new Logger(VeiculoRepositoryImpl.name);

  constructor(@Inject(EVENT_BUS) protected readonly eventBus: IEventBus) {
    super(eventBus);
  }

  async save(veiculo: Veiculo): Promise<void> {
    await prisma.veiculo.create({
      data: {
        id: veiculo.id,
        placa: veiculo.placa,
        chassi: veiculo.chassi,
        renavam: veiculo.renavam,
        modelo: veiculo.modelo,
        marca: veiculo.marca,
        ano: veiculo.ano,
        status: this.toPrismaStatus(veiculo.status.getValor()),
        createdAt: veiculo.createdAt,
        updatedAt: veiculo.updatedAt,
      },
    });
    await super.dispatchEvents(veiculo);
  }

  async findById(id: string): Promise<Veiculo | null> {
    const data = await prisma.veiculo.findUnique({ where: { id } });
    return data ? this.mapPrismaToVeiculo(data) : null;
  }

  async findByPlaca(placa: string): Promise<Veiculo | null> {
    const data = await prisma.veiculo.findUnique({ where: { placa } });
    return data ? this.mapPrismaToVeiculo(data) : null;
  }

  async findByChassi(chassi: string): Promise<Veiculo | null> {
    const data = await prisma.veiculo.findUnique({ where: { chassi } });
    return data ? this.mapPrismaToVeiculo(data) : null;
  }

  async findByRenavam(renavam: string): Promise<Veiculo | null> {
    const data = await prisma.veiculo.findUnique({ where: { renavam } });
    return data ? this.mapPrismaToVeiculo(data) : null;
  }

  async findByPlacaOrChassiOrRenavam(
    placa: string,
    chassi: string,
    renavam: string,
  ): Promise<Veiculo[]> {
    const data = await prisma.veiculo.findMany({
      where: {
        OR: [{ placa }, { chassi }, { renavam }],
      },
    });
    return data.map(this.mapPrismaToVeiculo);
  }

  async findAll(): Promise<Veiculo[]> {
    const data = await prisma.veiculo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return data.map(this.mapPrismaToVeiculo);
  }

  async update(veiculo: Veiculo): Promise<void> {
    await prisma.veiculo.update({
      where: { id: veiculo.id },
      data: {
        placa: veiculo.placa,
        chassi: veiculo.chassi,
        renavam: veiculo.renavam,
        modelo: veiculo.modelo,
        marca: veiculo.marca,
        ano: veiculo.ano,
        status: this.toPrismaStatus(veiculo.status.getValor()),
        updatedAt: veiculo.updatedAt,
      },
    });
    await super.dispatchEvents(veiculo);
  }

  async delete(id: string): Promise<void> {
    await prisma.veiculo.delete({ where: { id } });
  }

  private toPrismaStatus(status: string): any {
    // Mapeia os valores do domínio para o enum do Prisma
    switch (status) {
      case 'ativo':
        return 'ATIVO';
      case 'em ativação':
        return 'EM_ATIVACAO';
      case 'desativado':
        return 'DESATIVADO';
      case 'em desativação':
        return 'EM_DESATIVACAO';
      default:
        throw new Error('Status inválido');
    }
  }

  private toDomainStatus(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'ativo';
      case 'EM_ATIVACAO':
        return 'em ativação';
      case 'DESATIVADO':
        return 'desativado';
      case 'EM_DESATIVACAO':
        return 'em desativação';
      default:
        throw new Error('Status inválido');
    }
  }

  private mapPrismaToVeiculo = (data: any): Veiculo => {
    const veiculo = new (Veiculo as any)(
      {
        placa: data.placa,
        chassi: data.chassi,
        renavam: data.renavam,
        modelo: data.modelo,
        marca: data.marca,
        ano: data.ano,
        status: new StatusVeiculoValue(this.toDomainStatus(data.status) as any),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id,
    );
    return veiculo;
  };
}
