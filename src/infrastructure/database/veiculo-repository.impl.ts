import { Injectable, Logger, Inject } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { VeiculoRepository } from '../../domain/repositories/veiculo-repository.interface';
import { Veiculo } from '../../domain/entities/veiculo';
import { BaseRepository } from './base-repository';
import { IEventBus } from '../../application/event-bus/event-bus.interface';
import { StatusVeiculo, StatusVeiculoValue } from '../../domain/value-objects/status-veiculo';
import { EVENT_BUS } from '../config/injection-tokens';

@Injectable()
export class VeiculoRepositoryImpl extends BaseRepository implements VeiculoRepository {
  private readonly logger = new Logger(VeiculoRepositoryImpl.name);
  private db: sqlite3.Database;

  constructor(@Inject(EVENT_BUS) eventBus: IEventBus) {
    super(eventBus);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        this.logger.error('Erro ao conectar com banco de dados:', err);
      } else {
        this.logger.log('Conectado ao banco SQLite');
        this.createTable();
      }
    });
  }

  private createTable(): void {
    const sql = `
      CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        placa TEXT UNIQUE NOT NULL,
        chassi TEXT UNIQUE NOT NULL,
        renavam TEXT UNIQUE NOT NULL,
        modelo TEXT NOT NULL,
        marca TEXT NOT NULL,
        ano INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      )
    `;

    this.db.run(sql, (err) => {
      if (err) {
        this.logger.error('Erro ao criar tabela:', err);
      } else {
        this.logger.log('Tabela veiculos criada com sucesso');
      }
    });
  }

  async save(veiculo: Veiculo): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO veiculos (id, placa, chassi, renavam, modelo, marca, ano, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(sql, [
        veiculo.getId(),
        veiculo.getPlaca(),
        veiculo.getChassi(),
        veiculo.getRenavam(),
        veiculo.getModelo(),
        veiculo.getMarca(),
        veiculo.getAno(),
        veiculo.getStatus().getValor(),
        veiculo.getCreatedAt().toISOString(),
        veiculo.getUpdatedAt().toISOString()
      ], async (err) => {
        if (err) {
          this.logger.error('Erro ao salvar veículo:', err);
          reject(err);
        } else {
          await this.dispatchEvents(veiculo);
          resolve();
        }
      });
    });
  }

  async findById(id: string): Promise<Veiculo | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM veiculos WHERE id = ?';
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(this.mapRowToVeiculo(row));
        }
      });
    });
  }

  async findByPlaca(placa: string): Promise<Veiculo | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM veiculos WHERE placa = ?';
      
      this.db.get(sql, [placa], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(this.mapRowToVeiculo(row));
        }
      });
    });
  }

  async findByChassi(chassi: string): Promise<Veiculo | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM veiculos WHERE chassi = ?';
      
      this.db.get(sql, [chassi], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(this.mapRowToVeiculo(row));
        }
      });
    });
  }

  async findByRenavam(renavam: string): Promise<Veiculo | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM veiculos WHERE renavam = ?';
      
      this.db.get(sql, [renavam], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(this.mapRowToVeiculo(row));
        }
      });
    });
  }

  async findByPlacaOrChassiOrRenavam(placa: string, chassi: string, renavam: string): Promise<Veiculo[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM veiculos 
        WHERE placa = ? OR chassi = ? OR renavam = ?
      `;
      
      this.db.all(sql, [placa, chassi, renavam], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const veiculos = rows.map(row => this.mapRowToVeiculo(row));
          resolve(veiculos);
        }
      });
    });
  }

  async findAll(): Promise<Veiculo[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM veiculos ORDER BY created_at DESC';
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const veiculos = rows.map(row => this.mapRowToVeiculo(row));
          resolve(veiculos);
        }
      });
    });
  }

  async update(veiculo: Veiculo): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE veiculos 
        SET placa = ?, chassi = ?, renavam = ?, modelo = ?, marca = ?, ano = ?, status = ?, updated_at = ?
        WHERE id = ?
      `;

      this.db.run(sql, [
        veiculo.getPlaca(),
        veiculo.getChassi(),
        veiculo.getRenavam(),
        veiculo.getModelo(),
        veiculo.getMarca(),
        veiculo.getAno(),
        veiculo.getStatus().getValor(),
        veiculo.getUpdatedAt().toISOString(),
        veiculo.getId()
      ], async (err) => {
        if (err) {
          this.logger.error('Erro ao atualizar veículo:', err);
          reject(err);
        } else {
          await this.dispatchEvents(veiculo);
          resolve();
        }
      });
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM veiculos WHERE id = ?';
      
      this.db.run(sql, [id], (err) => {
        if (err) {
          this.logger.error('Erro ao deletar veículo:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private mapRowToVeiculo(row: any): Veiculo {
    return new Veiculo(
      row.id,
      row.placa,
      row.chassi,
      row.renavam,
      row.modelo,
      row.marca,
      row.ano,
      new StatusVeiculoValue(row.status as StatusVeiculo),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
} 