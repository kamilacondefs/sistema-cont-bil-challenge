import { Lancamento } from './lancamento.model';

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LancamentosResponse {
  data: Lancamento[];
  pagination: PaginationInfo;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string>;
}
