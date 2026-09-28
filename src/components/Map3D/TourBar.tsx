import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import { TourStop } from '../../types/map';

interface TourBarProps {
  isTourActive: boolean;
  isPaused: boolean;
  currentStopIndex: number;
  totalStops: number;
  currentStop?: TourStop;
  onStartTour: () => void;
  onPauseTour: () => void;
  onResumeTour: () => void;
  onNextStop: () => void;
  onPrevStop: () => void;
  onRestartTour: () => void;
  onExitTour: () => void;
}

export const TourBar: React.FC<TourBarProps> = ({
  isTourActive,
  isPaused,
  currentStopIndex,
  totalStops,
  currentStop,
  onStartTour,
  onPauseTour,
  onResumeTour,
  onNextStop,
  onPrevStop,
  onRestartTour,
  onExitTour,
}) => {
  if (!isTourActive) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={onStartTour}
          className="group relative px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF6A1A] via-[#FF843D] to-[#FF6A1A] bg-[length:200%_auto] hover:bg-right text-white font-bold text-sm tracking-wide shadow-2xl shadow-[#FF6A1A]/40 flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current text-white ml-0.5" />
          </div>
          <span>INICIAR SOBREVOO 3D</span>
          <span className="text-xs bg-black/25 px-2 py-0.5 rounded-full font-mono font-medium">
            12 PARADAS
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl pointer-events-auto select-none">
      <div className="bg-[#0E1923]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 sm:p-4 text-slate-100 flex flex-col gap-3">
        {/* Progress Bar & Indicators */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
            {Array.from({ length: totalStops }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-all duration-500 ${
                  idx < currentStopIndex
                    ? 'bg-[#FF6A1A]'
                    : idx === currentStopIndex
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-700/60'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
            {currentStopIndex + 1} / {totalStops}
          </span>
        </div>

        {/* Current Stop Narrated Caption */}
        {currentStop && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-2.5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#FF6A1A]/20 text-[#FF6A1A] border border-[#FF6A1A]/30">
                  {currentStop.badge}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {currentStop.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                {currentStop.narration}
              </p>
            </div>
          </div>
        )}

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Navigation left buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevStop}
              disabled={currentStopIndex === 0}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/40"
              title="Ponto anterior"
              aria-label="Ponto anterior do tour"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {isPaused ? (
              <button
                type="button"
                onClick={onResumeTour}
                className="px-4 py-2 rounded-xl bg-[#FF6A1A] hover:bg-[#e5590f] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF6A1A]/30 transition-all active:scale-95"
                title="Continuar tour"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continuar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseTour}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-600 transition-all active:scale-95"
                title="Pausar tour"
              >
                <Pause className="w-4 h-4 fill-current text-amber-400" />
                <span>Pausar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNextStop}
              disabled={currentStopIndex >= totalStops - 1}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/40"
              title="Próximo ponto"
              aria-label="Próximo ponto do tour"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onRestartTour}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors hidden sm:flex border border-slate-700/30"
              title="Reiniciar tour do início"
              aria-label="Reiniciar tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Exit Tour / Free Exploration */}
          <button
            type="button"
            onClick={onExitTour}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600/70 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Explorar Livremente</span>
            <span className="sm:hidden">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
