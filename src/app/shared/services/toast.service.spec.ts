import { TestBed } from '@angular/core/testing';
import { ToastService, ToastMessage } from './toast.service';
import { vi } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sucesso() should add success toast', () => {
    let currentToast: ToastMessage | null = null;
    service.toast$.subscribe(t => currentToast = t);

    service.success('Sucesso!');
    
    expect(currentToast).toBeTruthy();
    expect(currentToast!.message).toBe('Sucesso!');
    expect(currentToast!.type).toBe('success');
  });

  it('erro() should add error toast', () => {
    let currentToast: ToastMessage | null = null;
    service.toast$.subscribe(t => currentToast = t);

    service.error('Erro!');

    expect(currentToast).toBeTruthy();
    expect(currentToast!.message).toBe('Erro!');
    expect(currentToast!.type).toBe('error');
  });

  it('clear() should remove toast (emit null)', () => {
    let currentToast: ToastMessage | null = null;
    service.toast$.subscribe(t => currentToast = t);

    service.success('Teste');
    expect(currentToast).toBeTruthy();

    service.clear();
    expect(currentToast).toBeNull();
  });

  it('should remove toast automatically after duration', () => {
    vi.useFakeTimers();
    let currentToast: ToastMessage | null = null;
    service.toast$.subscribe(t => currentToast = t);

    service.show('Auto remove', 'success', 4000);
    
    expect(currentToast).toBeTruthy();
    
    vi.advanceTimersByTime(3999);
    expect(currentToast).toBeTruthy();
    
    vi.advanceTimersByTime(1); // 4000ms total
    expect(currentToast).toBeNull();

    vi.useRealTimers();
  });
});
