import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { LancamentoService } from '../../core/services/lancamento.service';
import { BalanceteService } from '../../core/services/balancete.service';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let lancamentoServiceSpy: { listar: any };
  let balanceteServiceSpy: { obter: any };
  let toastServiceSpy: { error: any };
  let routerSpy: { navigate: any };

  beforeEach(async () => {
    lancamentoServiceSpy = { listar: vi.fn() };
    balanceteServiceSpy = { obter: vi.fn() };
    toastServiceSpy = { error: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: LancamentoService, useValue: lancamentoServiceSpy },
        { provide: BalanceteService, useValue: balanceteServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    // Setup default returns
    lancamentoServiceSpy.listar.mockReturnValue(of({ data: [], pagination: { total: 0, pages: 0, page: 1, limit: 10 } }));
    balanceteServiceSpy.obter.mockReturnValue(of({ totalDebitos: 0, totalCreditos: 0, saldo: 0, count: 0 }));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call BalanceteService.obter() and LancamentoService.listar() on init', () => {
    expect(balanceteServiceSpy.obter).toHaveBeenCalled();
    expect(lancamentoServiceSpy.listar).toHaveBeenCalled();
  });

  it('should reload list and balancete when excluirChange is emitted', () => {
    // Reset calls from ngOnInit
    balanceteServiceSpy.obter.mockClear();
    lancamentoServiceSpy.listar.mockClear();

    // Trigger reload (simulating call from child component)
    component.carregarDados();

    expect(balanceteServiceSpy.obter).toHaveBeenCalled();
    expect(lancamentoServiceSpy.listar).toHaveBeenCalled();
  });

  it('should reload list when filtrosChange is emitted', () => {
    lancamentoServiceSpy.listar.mockClear();

    const newFiltros = { ...component.filtrosAtual, search: 'novo' };
    component.onFiltrosChange(newFiltros);

    expect(component.filtrosAtual.search).toBe('novo');
    expect(lancamentoServiceSpy.listar).toHaveBeenCalledWith(newFiltros);
  });
});
