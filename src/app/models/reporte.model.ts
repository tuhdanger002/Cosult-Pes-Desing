export interface ReportePesDetalle {
  NUM_PES: string;
  USUARIO: string;
  RESPONSABLE: string;
  ALCANCE?: string;
  ALIMENTADOR: string; // Nueva columna solicitada
  FECHA_INICIO: string;
  FECHA_FIN: string;
  NOTAS?: string;       // Nombre exacto en SQL
  OBSERVACIÓN?: string; // Nombre exacto en SQL con tilde
  CAUSA?: string;
  IsDelete?: number;
}