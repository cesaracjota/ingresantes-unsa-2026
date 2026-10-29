export interface Ingresante {
  id: string;
  numero: number;
  carrera: string;
  modalidad: string;
  modalidad_categoria: string;
  codigo: string;
  apellidos: string;
  nombres: string;
  nombre_completo: string;
  puntaje: number | null;
  puntaje_formateado: string;
}

export interface Stats {
  total_ingresantes: number;
  por_carrera: Record<string, number>;
  por_modalidad: Record<string, number>;
  puntaje_max: number;
  puntaje_min: number;
  puntaje_promedio: number;
  actualizado: string;
}

export type SortOption =
  | 'puesto'
  | 'puntaje_desc'
  | 'puntaje_asc'
  | 'apellidos_asc'
  | 'apellidos_desc';

export type ViewMode = 'table' | 'cards';
