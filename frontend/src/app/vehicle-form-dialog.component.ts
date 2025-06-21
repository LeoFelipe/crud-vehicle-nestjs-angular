import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from './material.module';
import { Vehicle } from './vehicles-list.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-form-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar Veículo' : 'Cadastrar Veículo' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding: 16px; min-width: 320px;">
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Placa</mat-label>
        <input matInput formControlName="placa" maxlength="10">
        <mat-error *ngIf="form.get('placa')?.invalid">Placa obrigatória (6-10 caracteres)</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Chassi</mat-label>
        <input matInput formControlName="chassi" maxlength="17">
        <mat-error *ngIf="form.get('chassi')?.invalid">Chassi obrigatório (17 caracteres)</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Renavam</mat-label>
        <input matInput formControlName="renavam" maxlength="11">
        <mat-error *ngIf="form.get('renavam')?.invalid">Renavam obrigatório (11 caracteres)</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Modelo</mat-label>
        <input matInput formControlName="modelo" maxlength="50">
        <mat-error *ngIf="form.get('modelo')?.invalid">Modelo obrigatório</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Marca</mat-label>
        <input matInput formControlName="marca" maxlength="50">
        <mat-error *ngIf="form.get('marca')?.invalid">Marca obrigatória</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 12px;">
        <mat-label>Ano</mat-label>
        <input matInput type="number" formControlName="ano" min="1900" max="2100">
        <mat-error *ngIf="form.get('ano')?.invalid">Ano obrigatório (>=1900)</mat-error>
      </mat-form-field>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
        <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </form>
  `
})
export class VehicleFormDialogComponent {
  form: FormGroup;
  isEditMode: boolean;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<VehicleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle?: Vehicle }
  ) {
    this.isEditMode = !!data?.vehicle;
    this.form = this.fb.group({
      placa: [data?.vehicle?.placa || '', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      chassi: [data?.vehicle?.chassi || '', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      renavam: [data?.vehicle?.renavam || '', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      modelo: [data?.vehicle?.modelo || '', [Validators.required, Validators.maxLength(50)]],
      marca: [data?.vehicle?.marca || '', [Validators.required, Validators.maxLength(50)]],
      ano: [data?.vehicle?.ano || '', [Validators.required, Validators.min(1900)]]
    });
  }

  onSubmit() {
    if (this.form.invalid || this.isSaving) {
      return;
    }
    this.isSaving = true;

    const vehicleData = this.form.value;
    let request$: Observable<Vehicle>;

    if (this.isEditMode) {
      request$ = this.http.put<Vehicle>(`/api/veiculos/${this.data.vehicle!.id}`, vehicleData);
    } else {
      request$ = this.http.post<Vehicle>('/api/veiculos', vehicleData);
    }

    request$.subscribe({
      next: (response: Vehicle) => {
        const message = this.isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!';
        this.snackBar.open(message, 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(response);
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = this.isEditMode ? 'Erro ao atualizar veículo.' : 'Erro ao cadastrar veículo.';

        if (err.error && Array.isArray(err.error.response) && err.error.response.length > 0) {
            errorMessage = err.error.response.join(', ');
        } else if (err.error && typeof err.error.message === 'string') {
            errorMessage = err.error.message;
        }

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSaving = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
