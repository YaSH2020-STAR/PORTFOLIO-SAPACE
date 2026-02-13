export type FastingType = 'water' | 'water-coffee' | 'dry' | 'custom';

export type FastingStatus = 'active' | 'completed' | 'cancelled';

export interface FastingSession {
  id: string;
  type: FastingType;
  startTime: string;
  endTime?: string;
  plannedDuration: number; // in hours
  notes?: string;
  status: FastingStatus;
}