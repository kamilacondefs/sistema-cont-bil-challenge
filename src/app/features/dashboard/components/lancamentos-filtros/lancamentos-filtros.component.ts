import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LancamentoFiltros } from '../../../../core/models/lancamento-filtros.model';
import { LancamentoTipo } from '../../../../core/enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../../../../core/enums/lancamento-status.enum';

@Component({
  selector: 'app-lancamentos-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamentos-filtros.component.html',
  styleUrls: ['./lancamentos-filtros.component.scss']
})
export class LancamentosFiltrosComponent {
  @Input() filtrosAtual!: LancamentoFiltros;
  @Output() filtrosChange = new EventEmitter<LancamentoFiltros>();

  // Enums for template
  LancamentoTipo = LancamentoTipo;
  LancamentoStatus = LancamentoStatus;

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.emitFiltros({ ...this.filtrosAtual, search: searchValue, page: 1 });
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    // Reset to page 1 when any filter changes
    this.emitFiltros({ ...this.filtrosAtual, page: 1 });
  }

  limparFiltros(): void {
    const defaultFilters: LancamentoFiltros = {
      page: 1,
      limit: 50,
      sort: 'data',
      order: 'desc',
      search: '',
      tipo: undefined, // Or TODOS if preferred by backend, but interface says optional
      status: undefined,
      dataInicio: undefined,
      dataFim: undefined
    };
    
    // Manually update local bound variables if needed or rely on parent passing back new filters
    // Here we emit, parent updates, and passes back via Input
    this.filtrosChange.emit(defaultFilters);
  }

  private emitFiltros(filtros: LancamentoFiltros): void {
    this.filtrosChange.emit(filtros);
  }
}
