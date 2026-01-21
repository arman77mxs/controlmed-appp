// Tipos principales de la aplicación ControlMed

export interface Medicamento {
  id: string;
  nombreMedicamento: string;
  nombreEnfermedad: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  intervaloHoras: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicamentoDTO {
  nombreMedicamento: string;
  nombreEnfermedad: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  intervaloHoras: number;
}

export interface UpdateMedicamentoDTO extends Partial<CreateMedicamentoDTO> {}

export interface DosisPrograma {
  fecha: string;
  hora: string;
  timestamp: Date;
  medicamentoId: string;
  nombreMedicamento: string;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasMedicamentos: boolean;
  medicamentos: DosisPrograma[];
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
