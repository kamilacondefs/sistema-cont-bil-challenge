import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LancamentosTableComponent } from './lancamentos-table.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Lancamento } from '../../../../core/models/lancamento.model';
import { LancamentoTipo } from '../../../../core/enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../../../../core/enums/lancamento-status.enum';
import { SortField } from '../../../../core/constants/api.constants';
import { vi } from 'vitest';

describe('LancamentosTableComponent', () => {
  let component: LancamentosTableComponent;
  let fixture: ComponentFixture<LancamentosTableComponent>;
  let routerSpy: { navigate: any };

  const mockLancamentos: Lancamento[] = [
    {
      id: '1',
      data: '2023-01-01',
      tipo: LancamentoTipo.DEBITO,
      valor: 100,
      conta: { codigo: '1', descricao: 'Conta 1' },
      historico: 'Hist 1',
      status: LancamentoStatus.CONFIRMADO
    }
  ];

  beforeEach(async () => {
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LancamentosTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentosTableComponent);
    component = fixture.componentInstance;
    
    // Default inputs
    component.lancamentos = mockLancamentos;
    component.filtrosAtual = {
      page: 1, limit: 10, sort: 'data', order: 'desc', search: ''
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render lancamentos received via @Input', () => {
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    // Depending on loading state or empty state, check if rows exist.
    // Default loading is false, lancamentos has 1 item.
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('Conta 1');
  });

  it('should emit ordenacaoChange when sortable header is clicked', () => {
    fixture.detectChanges();
    vi.spyOn(component.ordenacaoChange, 'emit');
    
    // Simulate click on a sortable header (e.g., Data)
    component.onSort('data');
    
    expect(component.ordenacaoChange.emit).toHaveBeenCalledWith({ sort: 'data' as SortField, order: 'asc' }); // Was desc, should flip to asc
  });

  it('should emit excluirChange when delete is confirmed', () => {
    fixture.detectChanges();
    vi.spyOn(component.excluirChange, 'emit');
    
    // Open modal
    component.onDeleteClick('1');
    expect(component.showDeleteModal).toBe(true);
    expect(component.lancamentoToDeleteId).toBe('1');
    
    // Confirm delete
    component.confirmDelete();
    
    expect(component.excluirChange.emit).toHaveBeenCalledWith('1');
    expect(component.showDeleteModal).toBe(false);
  });

  it('should display loading message when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingEl = fixture.debugElement.query(By.css('.loading-state'));
    expect(loadingEl).toBeTruthy();
    expect(loadingEl.nativeElement.textContent).toContain('Carregando');
  });

  it('should display empty message when lancamentos is empty and loading is false', () => {
    component.lancamentos = [];
    component.loading = false;
    fixture.detectChanges();

    const emptyEl = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.nativeElement.textContent).toContain('Nenhum lançamento encontrado');
  });
});
