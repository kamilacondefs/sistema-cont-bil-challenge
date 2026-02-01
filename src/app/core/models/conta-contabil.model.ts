import { ContaTipo } from '../enums/conta-tipo.enum';

export interface ContaContabil {
  id: string;
  codigo: string;
  descricao: string;
  tipo: ContaTipo;
}
