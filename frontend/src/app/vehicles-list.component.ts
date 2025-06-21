import { Component } from '@angular/core';
import { MaterialModule } from './material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleFormDialogComponent } from './vehicle-form-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Vehicle {
  id: string;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
  status: string;
}

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [MaterialModule, HttpClientModule, VehicleFormDialogComponent, ConfirmDialogComponent, FormsModule, CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Listagem de Veículos</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Placa, modelo ou marca">
            <button mat-icon-button matSuffix *ngIf="searchTerm" (click)="clearSearch()" title="Limpar busca">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            <span>Cadastrar</span>
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-container">
        {{error}}
      </div>

      <div class="table-container" *ngIf="!loading && !error">
        <table mat-table [dataSource]="filteredData" class="styled-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{element.id}}</td>
          </ng-container>
          <ng-container matColumnDef="placa">
            <th mat-header-cell *matHeaderCellDef>Placa</th>
            <td mat-cell *matCellDef="let element">{{element.placa}}</td>
          </ng-container>
          <ng-container matColumnDef="chassi">
            <th mat-header-cell *matHeaderCellDef>Chassi</th>
            <td mat-cell *matCellDef="let element">{{element.chassi}}</td>
          </ng-container>
          <ng-container matColumnDef="renavam">
            <th mat-header-cell *matHeaderCellDef>Renavam</th>
            <td mat-cell *matCellDef="let element">{{element.renavam}}</td>
          </ng-container>
          <ng-container matColumnDef="modelo">
            <th mat-header-cell *matHeaderCellDef>Modelo</th>
            <td mat-cell *matCellDef="let element">{{element.modelo}}</td>
          </ng-container>
          <ng-container matColumnDef="marca">
            <th mat-header-cell *matHeaderCellDef>Marca</th>
            <td mat-cell *matCellDef="let element">{{element.marca}}</td>
          </ng-container>
          <ng-container matColumnDef="ano">
            <th mat-header-cell *matHeaderCellDef>Ano</th>
            <td mat-cell *matCellDef="let element">{{element.ano}}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">
              <span class="status-badge" [ngClass]="'status-' + element.status.toLowerCase()">
                {{ element.status | titlecase }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="actions-header">Ações</th>
            <td mat-cell *matCellDef="let element" class="actions-cell">
              <button mat-icon-button color="primary" (click)="openEditDialog(element)" title="Editar Veículo">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="openDeleteDialog(element)" title="Excluir Veículo">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }

    .page-container {
      padding: 32px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 500;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      width: 280px;
    }

    .search-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .spinner-container, .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 48px 0;
    }

    .error-container {
      color: #f44336;
      font-size: 16px;
    }

    .table-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .styled-table {
      width: 100%;
      border-collapse: collapse;
    }

    .styled-table th, .styled-table td {
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .styled-table th {
      background-color: #f8f9fa;
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }

    .styled-table tr:last-child td {
      border-bottom: none;
    }

    .styled-table tr:hover {
      background-color: #f1f1f1;
    }

    .actions-header {
      text-align: right;
    }

    .actions-cell {
      text-align: right;
    }

    .actions-cell button {
      margin-left: 8px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      color: #fff;
      text-transform: capitalize;
    }

    .status-ativo {
      background-color: #4CAF50; /* Verde */
    }

    .status-em_ativacao {
      background-color: #FFC107; /* Âmbar */
    }

    .status-desativado {
      background-color: #616161; /* Cinza */
    }

    .status-em_desativacao {
      background-color: #FF9800; /* Laranja */
    }
  `]
})
export class VehiclesListComponent {
  displayedColumns: string[] = ['id', 'placa', 'chassi', 'renavam', 'modelo', 'marca', 'ano', 'status', 'actions'];
  dataSource: Vehicle[] = [];
  filteredData: Vehicle[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.loading = true;
    this.error = '';
    this.http.get<Vehicle[]>('/api/veiculos').subscribe({
      next: (data) => {
        this.dataSource = data;
        this.filteredData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar veículos.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredData = this.dataSource;
      return;
    }
    this.filteredData = this.dataSource.filter(v =>
      v.placa.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term) ||
      v.marca.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(VehicleFormDialogComponent, {
      width: '500px',
      data: { title: 'Cadastrar Veículo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('/api/veiculos', result).subscribe({
          next: () => {
            this.showNotification('Veículo cadastrado com sucesso!', 'success');
            this.fetchVehicles();
          },
          error: (err) => this.showNotification(err.error.message, 'error')
        });
      }
    });
  }

  openEditDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(VehicleFormDialogComponent, {
      width: '500px',
      data: { title: 'Editar Veículo', vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(`/api/veiculos/${vehicle.id}`, result).subscribe({
          next: () => {
            this.showNotification('Veículo atualizado com sucesso!', 'success');
            this.fetchVehicles();
          },
          error: (err) => this.showNotification(err.error.message, 'error')
        });
      }
    });
  }

  openDeleteDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o veículo de placa ${vehicle.placa}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.http.delete(`/api/veiculos/${vehicle.id}`).subscribe({
          next: () => {
            this.showNotification('Veículo excluído com sucesso!', 'success');
            this.fetchVehicles();
          },
          error: (err) => this.showNotification(err.error.message, 'error')
        });
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
