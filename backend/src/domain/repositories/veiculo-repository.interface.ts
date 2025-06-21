import { Veiculo } from '../entities/veiculo';

export interface IVeiculoRepository {
  save(veiculo: Veiculo): Promise<void>;
  findById(id: string): Promise<Veiculo | null>;
  findByPlaca(placa: string): Promise<Veiculo | null>;
  findByChassi(chassi: string): Promise<Veiculo | null>;
  findByRenavam(renavam: string): Promise<Veiculo | null>;
  findByPlacaOrChassiOrRenavam(
    placa: string,
    chassi: string,
    renavam: string,
  ): Promise<Veiculo[]>;
  findAll(): Promise<Veiculo[]>;
  update(veiculo: Veiculo): Promise<void>;
  delete(id: string): Promise<void>;
}
