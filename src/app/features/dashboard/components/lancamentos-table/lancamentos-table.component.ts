import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Lancamento } from '../../../../core/models/lancamento.model';
import { PaginationInfo } from '../../../../core/models/api-response.model';
import { LancamentoFiltros } from '../../../../core/models/lancamento-filtros.model';
import { SortField, SortOrder } from '../../../../core/constants/api.constants';
import { SharedModule } from '../../../../shared/shared.module';
import { LancamentoTipo } from '../../../../core/enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../../../../core/enums/lancamento-status.enum';

@Component({
  selector: 'app-lancamentos-table',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './lancamentos-table.component.html',
  styleUrls: ['./lancamentos-table.component.scss']
})
export class LancamentosTableComponent {
  @Input() lancamentos: Lancamento[] = [];
  @Input() pagination: PaginationInfo | null = null;
  @Input() loading: boolean = false;
  @Input() filtrosAtual!: LancamentoFiltros;

  @Output() paginaChange = new EventEmitter<number>();
  @Output() ordenacaoChange = new EventEmitter<{ sort: SortField, order: SortOrder }>();
  @Output() excluirChange = new EventEmitter<string>();

  LancamentoTipo = LancamentoTipo;
  LancamentoStatus = LancamentoStatus;

  showDeleteModal = false;
  lancamentoToDeleteId: string | null = null;

  constructor(private router: Router) {}

  onSort(field: string): void {
    // Only allow sorting on SortField types
    if (!this.isSortable(field)) return;

    const sortField = field as SortField;
    let newOrder: SortOrder = 'desc';

    if (this.filtrosAtual.sort === sortField) {
      newOrder = this.filtrosAtual.order === 'desc' ? 'asc' : 'desc';
    }

    this.ordenacaoChange.emit({ sort: sortField, order: newOrder });
  }

  isSortable(field: string): boolean {
    return ['data', 'valor', 'status', 'tipo'].includes(field);
  }

  getSortIcon(field: string): string {
    if (this.filtrosAtual.sort !== field) return '';
    return this.filtrosAtual.order === 'asc' ? '↑' : '↓';
  }

  onEdit(id: string): void {
    this.router.navigate(['/lancamento/editar', id]);
  }

  onDeleteClick(id: string): void {
    this.lancamentoToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.lancamentoToDeleteId) {
      this.excluirChange.emit(this.lancamentoToDeleteId);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.lancamentoToDeleteId = null;
  }

  onPageChange(page: number): void {
    if (this.pagination && page >= 1 && page <= this.pagination.totalPages) {
      this.paginaChange.emit(page);
    }
  }
}
