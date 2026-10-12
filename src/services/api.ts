/**
 * CAPSTONE API Service Layer
 * 
 * NOTE: For this frontend prototype phase, all operations use simulated local persistence
 * and in-memory mock responses with predictable latency.
 * When the Spring Boot REST backend is deployed, simply swap the implementations below
 * with fetch/Axios calls to http://localhost:8080/api/...
 */

import {
  TelemetryState,
  CognitivePillar,
  RadarAgent,
  SimulatorStage,
  CohortTestimonial,
  UserSettings,
} from '../types';
import {
  initialTelemetry,
  cognitivePillars,
  initialRadarAgents,
  simulatorStages,
  cohortTestimonials,
} from '../data/mockData';

const STORAGE_KEYS = {
  TELEMETRY: 'capstone_telemetry_v1',
  SETTINGS: 'capstone_settings_v1',
  AGENTS: 'capstone_agents_v1',
  SESSION_HISTORY: 'capstone_sessions_v1',
};

// Helper for simulated latency
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApiService = {
  // Telemetry & Metrics
  async getTelemetry(): Promise<TelemetryState> {
    await delay(150);
    const stored = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cached telemetry', e);
      }
    }
    return initialTelemetry;
  },

  async updateTelemetry(updates: Partial<TelemetryState>): Promise<TelemetryState> {
    await delay(100);
    const current = await this.getTelemetry();
    const next = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(next));
    return next;
  },

  // Cognitive Pillars
  async getPillars(): Promise<CognitivePillar[]> {
    await delay(100);
    return cognitivePillars;
  },

  // Tactical Radar Agents
  async getRadarAgents(): Promise<RadarAgent[]> {
    await delay(100);
    const stored = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cached agents', e);
      }
    }
    return initialRadarAgents;
  },

  async neutraliseAgent(agentId: number): Promise<{ success: boolean; bonusPoints: number }> {
    await delay(80);
    const agents = await this.getRadarAgents();
    const updated = agents.map((a) =>
      a.id === agentId ? { ...a, status: 'countered' as const, speech: 'Countermeasure Active! [STABILIZED]' } : a
    );
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updated));
    return { success: true, bonusPoints: 350 };
  },

  async resetRadarAgents(): Promise<RadarAgent[]> {
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    return initialRadarAgents;
  },

  // Simulator Stages
  async getSimulatorStages(): Promise<SimulatorStage[]> {
    await delay(100);
    return simulatorStages;
  },

  // Testimonials
  async getCohortTestimonials(): Promise<CohortTestimonial[]> {
    await delay(100);
    return cohortTestimonials;
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      soundEnabled: true,
      reducedMotion: false,
      highContrast: false,
      preferredLanguage: 'EN',
      drillDifficulty: 'Standard',
    };
  },

  async saveSettings(settings: UserSettings): Promise<UserSettings> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Drill Session Record (Future Spring Boot endpoint POST /api/games/sessions)
  async recordDrillSession(session: {
    pillarId: string;
    score: number;
    accuracy: number;
    durationSeconds: number;
    completed: boolean;
  }): Promise<{ sessionId: string; status: string }> {
    await delay(250);
    const id = 'sess_' + Math.random().toString(36).substring(2, 9);
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY) || '[]');
    history.unshift({ ...session, id, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history.slice(0, 50)));
    return { sessionId: id, status: 'synced_to_local_store' };
  },
};
