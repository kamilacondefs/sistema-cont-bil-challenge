export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  LANCAMENTOS: '/entries',
  LANCAMENTOS_BALANCETE: '/dashboard/summary',
  CONTAS: '/accounts'
} as const;

export const PAGINATION = {
  PAGE_SIZE: 50,
  PAGE: 1
} as const;

export const SORTABLE_FIELDS = ['data', 'valor', 'status', 'tipo'] as const;
export type SortField = typeof SORTABLE_FIELDS[number];
export type SortOrder = 'asc' | 'desc';
