import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format 1500 to "R$ 1.500,00"', () => {
    // Note: Intl.NumberFormat output might contain non-breaking spaces (\u00A0)
    // We should normalize spaces for comparison or use contain
    const result = pipe.transform(1500);
    // Replace non-breaking space with normal space
    const normalized = result.replace(/\u00A0/g, ' ');
    expect(normalized).toBe('R$ 1.500,00');
  });

  it('should format 0 to "R$ 0,00"', () => {
    const result = pipe.transform(0);
    const normalized = result.replace(/\u00A0/g, ' ');
    expect(normalized).toBe('R$ 0,00');
  });

  it('should format 1000000 to "R$ 1.000.000,00"', () => {
    const result = pipe.transform(1000000);
    const normalized = result.replace(/\u00A0/g, ' ');
    expect(normalized).toBe('R$ 1.000.000,00');
  });

  it('should format 99.5 to "R$ 99,50"', () => {
    const result = pipe.transform(99.5);
    const normalized = result.replace(/\u00A0/g, ' ');
    expect(normalized).toBe('R$ 99,50');
  });
});
