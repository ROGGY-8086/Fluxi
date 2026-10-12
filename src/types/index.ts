export interface TelemetryState {
  recallBalance: number; // e.g. 9.16B represented as float
  perSecondGain: number; // e.g. 214.1M
  velocity: string;
  errorDriftIndex: string;
  dailyFocusFee: number;
  focusTax: number;
  dailyModelRamp: number;
  xpPerMin: number;
  streak: number;
  driftReduction: number;
  ratValue: number;
  nodeId: string;
  protocolStatus: string;
  isEscalating: boolean;
}

export type PillarDrillType = 'dual-n-back' | 'inhibitory' | 'facial-associator' | 'synaptic-velocity';

export interface CognitivePillar {
  id: string;
  number: string;
  title: string;
  iconName: 'target' | 'lightbulb' | 'badge' | 'zap';
  description: string;
  metricLabel: string;
  metricValue: string;
  metricType: 'recall' | 'distraction' | 'retention' | 'velocity';
  accentColor: string;
  drillType: PillarDrillType;
}

export interface RadarAgent {
  id: number;
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  status: 'active' | 'countered' | 'threat';
  speech: string;
  decayTime: number;
}

export interface SimulatorStage {
  step: number;
  maxSteps: number;
  title: string;
  instruction: string;
  targetCount: number;
  completed: boolean;
}

export interface CohortTestimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
  streakDays: number;
  scorePts: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  preferredLanguage: 'EN' | 'MR' | 'HI';
  drillDifficulty: 'Adaptive' | 'Standard' | 'Isometric Hard';
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  type?: 'success' | 'info' | 'warning';
}
