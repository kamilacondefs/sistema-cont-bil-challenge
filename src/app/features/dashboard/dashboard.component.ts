import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { LancamentoService } from '../../core/services/lancamento.service';
import { BalanceteService } from '../../core/services/balancete.service';
import { LancamentoFiltros } from '../../core/models/lancamento-filtros.model';
import { Lancamento } from '../../core/models/lancamento.model';
import { Balancete } from '../../core/models/balancete.model';
import { PaginationInfo } from '../../core/models/api-response.model';
import { SortField, SortOrder } from '../../core/constants/api.constants';
import { ResumoCardsComponent } from './components/resumo-cards/resumo-cards.component';
import { LancamentosTableComponent } from './components/lancamentos-table/lancamentos-table.component';
import { LancamentosFiltrosComponent } from './components/lancamentos-filtros/lancamentos-filtros.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ResumoCardsComponent,
    LancamentosTableComponent,
    LancamentosFiltrosComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  balancete: Balancete | null = null;
  lancamentos: Lancamento[] = [];
  pagination: PaginationInfo | null = null;
  loading = false;

  filtrosAtual: LancamentoFiltros = {
    page: 1,
    limit: 50,
    sort: 'data',
    order: 'desc',
    search: '',
    tipo: undefined,
    status: undefined,
    dataInicio: undefined,
    dataFim: undefined
  };

  constructor(
    private lancamentoService: LancamentoService,
    private balanceteService: BalanceteService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    
    // Using forkJoin to load both in parallel, but handle independently if needed later
    // For now, simpler to just trigger both
    this.carregarBalancete();
    this.carregarLancamentos();
  }

  carregarBalancete(): void {
    // Balancete service parameters: dataInicio, dataFim, status
    // We only pass date filters if they exist in filtrosAtual
    const { dataInicio, dataFim, status } = this.filtrosAtual;
    
    this.balanceteService.obter().subscribe({
      next: (dados) => {
        this.balancete = dados;
      },
      error: () => {
        this.balancete = null;
      }
    });
  }

  carregarLancamentos(): void {
    this.loading = true;
    this.lancamentoService.listar(this.filtrosAtual)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.lancamentos = response.data;
          this.pagination = response.pagination;
        },
        error: () => {
          this.lancamentos = [];
          this.pagination = null;
        }
      });
  }

  onFiltrosChange(novosFiltros: LancamentoFiltros): void {
    this.filtrosAtual = novosFiltros;
    this.carregarLancamentos();
    this.carregarBalancete(); // Refresh summary based on new filters
  }

  onPaginaChange(pagina: number): void {
    this.filtrosAtual.page = pagina;
    this.carregarLancamentos();
  }

  onOrdenacaoChange(ordenacao: { sort: SortField, order: SortOrder }): void {
    this.filtrosAtual.sort = ordenacao.sort;
    this.filtrosAtual.order = ordenacao.order;
    this.carregarLancamentos();
  }

  onExcluir(id: string): void {
    this.lancamentoService.excluir(id).subscribe({
      next: () => {
        this.toastService.success('Lançamento excluído com sucesso!');
        this.carregarLancamentos();
        this.carregarBalancete();
      },
      error: () => {
        // Error handling is done by interceptor, but we could add specific handling here if needed
      }
    });
  }

  novoLancamento(): void {
    this.router.navigate(['/lancamento/novo']);
  }
}
