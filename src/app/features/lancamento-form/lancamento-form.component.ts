import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';

import { LancamentoService } from '../../core/services/lancamento.service';
import { ContaContabilService } from '../../core/services/conta-contabil.service';
import { ToastService } from '../../shared/services/toast.service';
import { LancamentoTipo } from '../../core/enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../../core/enums/lancamento-status.enum';
import { ContaContabil } from '../../core/models/conta-contabil.model';
import { LancamentoCreateDTO } from '../../core/models/lancamento.model';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-lancamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  lancamentoId: string | null = null;
  loading = false;
  saving = false;
  
  contas: ContaContabil[] = [];
  filteredContas!: Observable<ContaContabil[]>;

  LancamentoTipo = LancamentoTipo;
  LancamentoStatus = LancamentoStatus;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lancamentoService: LancamentoService,
    private contaService: ContaContabilService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadContas();
    this.checkRoute();
  }

  private initForm(): void {
    this.form = this.fb.group({
      data: [null, [Validators.required, this.futureDateValidator]],
      tipo: [null, Validators.required],
      conta: [null, [Validators.required, this.contaSelectedValidator]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      historico: ['', [Validators.required, Validators.minLength(5)]],
      documento: [''],
      status: [LancamentoStatus.PROVISORIO, Validators.required]
    });

    this.setupAutocomplete();
  }

  private loadContas(): void {
    this.contaService.listar().subscribe(contas => {
      this.contas = contas;
      // Trigger value changes to update filter if value already exists
      this.form.get('conta')?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    });
  }

  private setupAutocomplete(): void {
    this.filteredContas = this.form.get('conta')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.descricao;
        return name ? this._filterContas(name as string) : this.contas.slice();
      })
    );
  }

  private _filterContas(value: string): ContaContabil[] {
    const filterValue = value.toLowerCase();
    return this.contas.filter(conta => 
      conta.descricao.toLowerCase().includes(filterValue) || 
      conta.codigo.toLowerCase().includes(filterValue)
    );
  }

  displayConta(conta: ContaContabil): string {
    return conta ? `${conta.codigo} - ${conta.descricao}` : '';
  }

  private checkRoute(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.lancamentoId = id;
        this.loadLancamento(id);
      }
    });
  }

  private loadLancamento(id: string): void {
    this.loading = true;
    this.lancamentoService.obter(id).subscribe({
      next: (lancamento) => {
        // Need to find the full ContaContabil object to set correctly in autocomplete
        // Assuming the API returns a summary, but we have the full list loaded or loading
        // We might need to wait for contas to load. For simplicity, we just set the value.
        // If contas are not loaded yet, displayFn handles it gracefully?
        // Actually, we should probably wait for both. But let's set it.
        
        // Convert string date to Date object for datepicker
        const dataObj = new Date(lancamento.data);
        // Fix timezone issue by setting time to noon or handling UTC explicitly if needed.
        // Here assuming the date string is YYYY-MM-DD, parsing it as local date.
        // Actually, 'new Date("2023-01-01")' is UTC, which might show as previous day in local time.
        // Better to split and create local date.
        const [year, month, day] = lancamento.data.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        this.form.patchValue({
          data: localDate,
          tipo: lancamento.tipo,
          conta: lancamento.conta,
          valor: lancamento.valor,
          historico: lancamento.historico,
          documento: lancamento.documento,
          status: lancamento.status
        });
        
        // If contaContabil from API is just a summary {codigo, descricao}, we need to make sure
        // it works with our autocomplete which expects ContaContabil (with ID).
        // If the types match enough, it's fine.
        
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Erro ao carregar lançamento.');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    // Prepare DTO
    const dto: LancamentoCreateDTO = {
      ...formValue,
      data: this.formatDate(formValue.data),
      // conta should be the object selected from autocomplete
      conta: {
        codigo: formValue.conta.codigo,
        descricao: formValue.conta.descricao
      }
    };

    const request$ = this.isEditMode
      ? this.lancamentoService.atualizar(this.lancamentoId!, dto)
      : this.lancamentoService.criar(dto);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditMode ? 'Lançamento atualizado com sucesso!' : 'Lançamento criado com sucesso!'
        );
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.saving = false;
        // Error toast handled by interceptor
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  // Validators
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  contaSelectedValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    // Check if value is an object (selected) or just a string (typed but not selected)
    if (value && typeof value === 'string') {
      return { requireSelection: true };
    }
    return null;
  }

  // Helpers
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
