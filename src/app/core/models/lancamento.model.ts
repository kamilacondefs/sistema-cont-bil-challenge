import { LancamentoTipo } from '../enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../enums/lancamento-status.enum';

export interface ContaContabilResumo {
  codigo: string;
  descricao: string;
}

export interface Lancamento {
  id: string;
  data: string;
  tipo: LancamentoTipo.DEBITO | LancamentoTipo.CREDITO;
  conta: ContaContabilResumo;
  valor: number;
  historico: string;
  documento?: string;
  status: LancamentoStatus.PROVISORIO | LancamentoStatus.CONFIRMADO | LancamentoStatus.CANCELADO;
}

export interface LancamentoCreateDTO {
  data: string;
  tipo: LancamentoTipo.DEBITO | LancamentoTipo.CREDITO;
  conta: ContaContabilResumo;
  valor: number;
  historico: string;
  documento?: string;
  status: LancamentoStatus.PROVISORIO | LancamentoStatus.CONFIRMADO;
}
