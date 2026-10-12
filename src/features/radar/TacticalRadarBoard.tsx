import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings, Crosshair, Folder, UserCheck, ShieldAlert, Sparkles, Plus, Minus } from 'lucide-react';
import { TelemetryState, RadarAgent, ToastMessage } from '../../types';
import { ApiService } from '../../services/api';
import { soundFx } from '../../utils/audio';

interface TacticalRadarBoardProps {
  telemetry: TelemetryState;
  onUpdateTelemetry: (updates: Partial<TelemetryState>) => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onOpenSettings: () => void;
}

export const TacticalRadarBoard: React.FC<TacticalRadarBoardProps> = ({
  telemetry,
  onUpdateTelemetry,
  onAddToast,
  onOpenSettings,
}) => {
  const [agents, setAgents] = useState<RadarAgent[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [matchPoints, setMatchPoints] = useState<number>(43);
  const [activeRipple, setActiveRipple] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    ApiService.getRadarAgents().then((data) => setAgents(data));
  }, []);

  // Handle agent countermeasure drop
  const handleAgentClick = async (agent: RadarAgent) => {
    soundFx.playPing();
    setActiveRipple({ x: agent.x, y: agent.y });
    setTimeout(() => setActiveRipple(null), 700);

    const result = await ApiService.neutraliseAgent(agent.id);
    if (result.success) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id
            ? { ...a, status: 'countered', speech: 'Distraction neutralized! [SHIELDED]' }
            : a
        )
      );

      const newPoints = Math.min(60, matchPoints + 3);
      setMatchPoints(newPoints);
      onUpdateTelemetry({
        recallBalance: +(telemetry.recallBalance + 0.05).toFixed(2),
        xpPerMin: telemetry.xpPerMin + 120,
      });

      onAddToast({
        title: `COUNTERMEASURE DEPLOYED: ${agent.label}`,
        detail: `Neutralized distraction popup. +350 PTS added to working memory buffer.`,
        type: 'success',
      });
    }
  };

  const handleAdjustTax = (delta: number) => {
    soundFx.playClick();
    const newTax = Math.max(5, Math.min(30, telemetry.focusTax + delta));
    onUpdateTelemetry({ focusTax: newTax });
    onAddToast({
      title: `FOCUS TAX RE-INDEXED: ${newTax}%`,
      detail: 'Dynamic cognitive allocation model recalibrated.',
      type: 'info',
    });
  };

  const handleResetBoard = async () => {
    soundFx.playClick();
    const fresh = await ApiService.resetRadarAgents();
    setAgents(fresh);
    setMatchPoints(43);
    onAddToast({
      title: 'TACTICAL RADAR RESET',
      detail: 'Distraction vectors replenished for drill evaluation.',
      type: 'info',
    });
  };

  return (
    <section className="bg-white border-b-2 border-ink-950 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-ink-950/20">
          {/* Left: Recall Balance */}
          <div className="md:col-span-4 flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-3xl sm:text-4xl text-ink-950 tracking-tight">
                ${telemetry.recallBalance}B
              </span>
              <span className="text-xs font-mono font-bold text-ink-500 uppercase tracking-wider">
                RECALL BALANCE
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700">
                +{telemetry.perSecondGain}M PER SECOND
              </span>
            </div>
            <div className="w-full bg-parchment-200 h-2 rounded-full mt-2 overflow-hidden border border-ink-950/20">
              <div
                className="bg-ink-950 h-full transition-all duration-300"
                style={{ width: `${(matchPoints / 60) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-ink-400 mt-1 uppercase">
              SYNC IN PROGRESS...
            </span>
          </div>

          {/* Middle: Threat Alert Ticker */}
          <div className="md:col-span-5 text-center flex flex-col items-center justify-center p-3 rounded-xl bg-red-50/60 border border-red-200">
            <div className="flex items-center gap-2 text-labRed font-display font-extrabold text-sm sm:text-base tracking-wider uppercase animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              <span>THEY ARE GATHERING AT YOUR POST</span>
            </div>
            <div className="text-[11px] font-mono text-ink-700 mt-0.5 tracking-tight uppercase">
              YELLOW DRONES DETECTED NEAR LAB — STATUS: ESCALATING
            </div>
          </div>

          {/* Right: Focus Tax Controller */}
          <div className="md:col-span-3 flex justify-end">
            <div className="bg-parchment-50 border-2 border-ink-950 rounded-xl p-3 w-full max-w-[210px] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-extrabold text-2xl text-ink-950 leading-none">
                    {telemetry.focusTax}%
                  </span>
                  <span className="text-[10px] font-mono block text-ink-500 uppercase font-semibold">
                    FOCUS TAX
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjustTax(-1)}
                    className="w-6 h-6 rounded border border-ink-950 bg-white flex items-center justify-center font-bold hover:bg-parchment-200 active:scale-95 cursor-pointer"
                    title="Decrease focus tax"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAdjustTax(1)}
                    className="w-6 h-6 rounded border border-ink-950 bg-white flex items-center justify-center font-bold hover:bg-parchment-200 active:scale-95 cursor-pointer"
                    title="Increase focus tax"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-[10px] font-mono text-ink-500 flex justify-between">
                <span>Daily model ramp</span>
                <span className="font-bold text-ink-900">{telemetry.dailyModelRamp}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Radar Canvas Container */}
        <div className="mt-6 relative bg-parchment-100 rounded-2xl border-2 border-ink-950 overflow-hidden shadow-brutal p-4 min-h-[360px] md:min-h-[440px] flex flex-col justify-between">
          {/* Top Instruction Pill */}
          <div className="flex justify-center z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-ink-950 text-xs font-mono font-bold shadow-sm uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-labYellow animate-ping"></span>
              <span>[ CLICK ANY AGENT TO DROP A DISTRACTION COUNTER ]</span>
            </div>
          </div>

          {/* Interactive Agent Floor Plan */}
          <div className="relative w-full h-64 md:h-80 my-4 select-none">
            {/* Background architectural ellipses and perspective grids */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <ellipse cx="400" cy="180" rx="120" ry="60" stroke="#121316" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
              <ellipse cx="600" cy="180" rx="120" ry="60" stroke="#121316" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
              <ellipse cx="500" cy="220" rx="350" ry="120" stroke="#121316" strokeWidth="1" fill="none" />
              <line x1="200" y1="200" x2="800" y2="200" stroke="#121316" strokeWidth="0.8" strokeDasharray="6 6" />
            </svg>

            {/* Expanding Ripple Effect upon countermeasure */}
            {activeRipple && (
              <div
                className="absolute w-24 h-24 -ml-12 -mt-12 rounded-full border-2 border-labYellow bg-labYellow/20 animate-ping pointer-events-none"
                style={{ left: `${activeRipple.x}%`, top: `${activeRipple.y}%` }}
              />
            )}

            {/* Dynamic Interactive Agents */}
            {agents.map((agent) => {
              const isCountered = agent.status === 'countered';
              const isThreat = agent.status === 'threat';

              return (
                <motion.div
                  key={agent.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
                  onClick={() => handleAgentClick(agent)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Speech bubble / distraction cue */}
                  <div className="absolute -top-7 -left-12 whitespace-nowrap bg-white border border-ink-950 px-2 py-0.5 rounded shadow-sm text-[10px] font-mono pointer-events-none z-10 transition-transform group-hover:-translate-y-1">
                    <span className={isCountered ? 'text-emerald-700 font-bold' : isThreat ? 'text-labRed font-bold' : 'text-ink-800'}>
                      {agent.speech}
                    </span>
                  </div>

                  {/* Agent Tag Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-ink-950 shadow-sm transition-colors ${
                      isCountered
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-800'
                        : isThreat
                        ? 'bg-labYellow text-ink-950 border-ink-950 animate-bounce'
                        : 'bg-white text-ink-900'
                    }`}
                  >
                    <span>{agent.label}</span>
                  </div>

                  {/* Stick Figure Silhouette Icon */}
                  <div className="w-4 h-6 mx-auto mt-1 flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full border border-ink-950 ${
                        isCountered ? 'bg-emerald-500' : 'bg-labYellow'
                      }`}
                    ></div>
                    <div className="w-0.5 h-3 bg-ink-950"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Interactive Control Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-ink-950/20 bg-white/70 p-3 rounded-xl backdrop-blur-sm z-10">
            {/* Play/Pause & Points Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="w-8 h-8 rounded-full border-2 border-ink-950 bg-white flex items-center justify-center hover:bg-parchment-200 active:scale-95 shadow-sm cursor-pointer"
                aria-label={isPlaying ? 'Pause drill simulation' : 'Play drill simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <div className="flex items-center gap-2">
                <div className="text-xs font-mono font-bold">
                  <span>{matchPoints} MATCH POINTS / 60</span>
                </div>
                <div className="w-24 sm:w-36 h-3 bg-parchment-200 rounded-full border border-ink-950 overflow-hidden">
                  <div
                    className="bg-labYellow h-full transition-all duration-300"
                    style={{ width: `${(matchPoints / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Center Status Badge */}
            <div className="text-xs font-mono font-bold px-3 py-1 rounded bg-parchment-100 border border-ink-950/30 text-ink-800">
              STATUS: PANEL IN DRILL — CLICK NODE TO DEFEND
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="w-8 h-8 rounded-full border-2 border-ink-950 bg-labYellow flex items-center justify-center hover:bg-labYellow-hover active:scale-95 shadow-sm cursor-pointer"
                title="Tactical configuration"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  handleResetBoard();
                }}
                className="w-8 h-8 rounded-full border-2 border-ink-950 bg-white flex items-center justify-center hover:bg-parchment-200 active:scale-95 shadow-sm cursor-pointer"
                title="Reset drill targets"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onAddToast({
                    title: 'ARCHIVED TELEMETRY',
                    detail: 'Exported 7 active radar distraction logs to memory vault.',
                    type: 'info',
                  });
                }}
                className="w-8 h-8 rounded-full border-2 border-ink-950 bg-white flex items-center justify-center hover:bg-parchment-200 active:scale-95 shadow-sm cursor-pointer"
                title="View memory archives"
              >
                <Folder className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Running Telemetry Ticker Underneath */}
        <div className="mt-4 py-2 px-4 bg-parchment-100 rounded-lg border border-ink-950/20 overflow-x-auto whitespace-nowrap text-[11px] font-mono text-ink-700 flex items-center justify-between gap-6">
          <span>
            XP/MIN: <strong className="text-ink-950">{telemetry.xpPerMin.toLocaleString()}</strong>
          </span>
          <span className="text-ink-400">/</span>
          <span>
            STREAK: <strong className="text-ink-950">{telemetry.streak}</strong>
          </span>
          <span className="text-ink-400">/</span>
          <span>
            DRIFT REDUCTION: <strong className="text-emerald-700">{telemetry.driftReduction}%</strong>
          </span>
          <span className="text-ink-400">/</span>
          <span>
            RAT: <strong className="text-ink-950">{telemetry.ratValue}</strong>
          </span>
          <span className="text-ink-400">/</span>
          <span>TX FEE: <strong className="text-ink-950">WAIVED</strong></span>
          <span className="text-ink-400">/</span>
          <span>
            NODE: <strong className="text-ink-950">{telemetry.nodeId}</strong>
          </span>
          <span className="text-ink-400">/</span>
          <span className="font-bold text-ink-950 bg-white px-2 py-0.5 rounded border border-ink-950/30">
            PROTOCOL ACTIVE: {telemetry.protocolStatus}
          </span>
        </div>
      </div>
    </section>
  );
};
