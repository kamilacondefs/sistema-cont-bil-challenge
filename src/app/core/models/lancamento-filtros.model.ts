import { LancamentoTipo } from '../enums/lancamento-tipo.enum';
import { LancamentoStatus } from '../enums/lancamento-status.enum';
import { SortField, SortOrder } from '../constants/api.constants';

export interface LancamentoFiltros {
  page: number;
  limit: number;
  sort: SortField;
  order: SortOrder;
  search?: string;
  tipo?: LancamentoTipo;
  status?: LancamentoStatus;
  contaCodigo?: string;
  dataInicio?: string;
  dataFim?: string;
}
