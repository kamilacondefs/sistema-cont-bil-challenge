import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LancamentoFormComponent } from './lancamento-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LancamentoService } from '../../core/services/lancamento.service';
import { ContaContabilService } from '../../core/services/conta-contabil.service';
import { ToastService } from '../../shared/services/toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LancamentoStatus } from '../../core/enums/lancamento-status.enum';
import { LancamentoTipo } from '../../core/enums/lancamento-tipo.enum';
import { vi } from 'vitest';

describe('LancamentoFormComponent', () => {
  let component: LancamentoFormComponent;
  let fixture: ComponentFixture<LancamentoFormComponent>;
  let lancamentoServiceSpy: { obter: any, criar: any, atualizar: any };
  let contaServiceSpy: { listar: any };
  let toastServiceSpy: { success: any, error: any };
  let routerSpy: { navigate: any };
  
  // Mock ActivatedRoute
  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => key === 'id' ? null : null // Default to Create mode
      }
    },
    paramMap: of({
      get: (key: string) => key === 'id' ? null : null
    })
  };

  beforeEach(async () => {
    lancamentoServiceSpy = { obter: vi.fn(), criar: vi.fn(), atualizar: vi.fn() };
    contaServiceSpy = { listar: vi.fn() };
    toastServiceSpy = { success: vi.fn(), error: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        LancamentoFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: LancamentoService, useValue: lancamentoServiceSpy },
        { provide: ContaContabilService, useValue: contaServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    contaServiceSpy.listar.mockReturnValue(of([
      { id: '1', codigo: '1', descricao: 'Conta Teste', tipo: 'DEBITO', permiteLancamento: true }
    ]));

    fixture = TestBed.createComponent(LancamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start empty with default status PROVISORIO in CREATE mode', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.form.get('status')?.value).toBe(LancamentoStatus.PROVISORIO);
    expect(component.form.get('historico')?.value).toBe('');
  });

  it('should disable save button when form is invalid', () => {
    expect(component.form.valid).toBe(false);
    // Check button state in template if needed, or just form validity
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('should call criar() when form is valid and save clicked in CREATE mode', () => {
    // Fill form
    component.form.patchValue({
      data: new Date('2023-01-01'), // Past/Present date
      tipo: LancamentoTipo.DEBITO,
      conta: { id: '1', codigo: '1', descricao: 'Conta Teste' }, // Depending on how autocomplete handles value
      valor: 100,
      historico: 'Teste de criação',
      status: LancamentoStatus.PROVISORIO
    });

    lancamentoServiceSpy.criar.mockReturnValue(of({} as any));

    // Submit
    component.onSubmit();

    expect(lancamentoServiceSpy.criar).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

describe('LancamentoFormComponent - Edit Mode', () => {
  let component: LancamentoFormComponent;
  let fixture: ComponentFixture<LancamentoFormComponent>;
  let lancamentoServiceSpy: { obter: any, atualizar: any };
  let contaServiceSpy: { listar: any };
  
  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => key === 'id' ? '123' : null
      }
    },
    paramMap: of({
      get: (key: string) => key === 'id' ? '123' : null
    })
  };

  beforeEach(async () => {
    lancamentoServiceSpy = { obter: vi.fn(), atualizar: vi.fn() };
    contaServiceSpy = { listar: vi.fn() };
    const toastSpy = { success: vi.fn(), error: vi.fn() };
    const routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LancamentoFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: LancamentoService, useValue: lancamentoServiceSpy },
        { provide: ContaContabilService, useValue: contaServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    contaServiceSpy.listar.mockReturnValue(of([]));
    lancamentoServiceSpy.obter.mockReturnValue(of({
      id: '123',
      data: '2023-01-01',
      tipo: LancamentoTipo.CREDITO,
      conta: { id: '1', codigo: '1', descricao: 'Conta', tipo: 'CREDITO', permiteLancamento: true },
      valor: 500,
      historico: 'Edição',
      status: LancamentoStatus.CONFIRMADO
    } as any));

    fixture = TestBed.createComponent(LancamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call obter() and populate form in EDIT mode', () => {
    expect(component.isEditMode).toBe(true);
    expect(lancamentoServiceSpy.obter).toHaveBeenCalledWith('123');
    expect(component.form.get('historico')?.value).toBe('Edição');
    expect(component.form.get('valor')?.value).toBe(500);
  });

  it('should call atualizar() when form is valid and save clicked in EDIT mode', () => {
    // Form should be valid from load
    expect(component.form.valid).toBe(true);

    lancamentoServiceSpy.atualizar.mockReturnValue(of({} as any));

    component.onSubmit();

    expect(lancamentoServiceSpy.atualizar).toHaveBeenCalled();
  });
});
