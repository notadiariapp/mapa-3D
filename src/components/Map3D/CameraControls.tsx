import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Compass,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  Maximize2,
  Eye,
  Keyboard,
  Navigation,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CameraAction } from '../../types/map';

interface CameraControlsProps {
  onAction: (action: CameraAction) => void;
  currentHeading: number; // in degrees
  currentPitch: number;   // in degrees
  isTourActive?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onAction,
  currentHeading,
  currentPitch,
  isTourActive = false,
}) => {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeIntervalRef = useRef<number | null>(null);

  // Helper for holding down a button to continuously perform an action
  const handleMouseDown = useCallback((action: CameraAction) => {
    // Immediate step
    onAction(action);

    // Clear any existing interval
    if (activeIntervalRef.current) {
      window.clearInterval(activeIntervalRef.current);
    }

    // Start repeating after a short delay
    const timeoutId = window.setTimeout(() => {
      activeIntervalRef.current = window.setInterval(() => {
        onAction(action);
      }, 55);
    }, 220);

    const handleMouseUp = () => {
      window.clearTimeout(timeoutId);
      if (activeIntervalRef.current) {
        window.clearInterval(activeIntervalRef.current);
        activeIntervalRef.current = null;
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
  }, [onAction]);

  useEffect(() => {
    return () => {
      if (activeIntervalRef.current) {
        window.clearInterval(activeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2 pointer-events-auto select-none">
      {/* Compass / Orientation indicator */}
      <div className="flex items-center gap-1.5 bg-[#0E1923]/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1.5 shadow-xl">
        <button
          type="button"
          onClick={() => onAction('reset_north')}
          title="Resetar orientação para o Norte (N)"
          aria-label="Apontar para o Norte"
          className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 transition-colors group"
        >
          <div
            className="w-7 h-7 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            <Compass className="w-5 h-5 text-slate-300 group-hover:text-[#FF6A1A]" />
          </div>
          <span className="absolute -top-1 right-1 text-[9px] font-bold text-[#FF6A1A]">N</span>
        </button>

        {/* Quick Pitch views */}
        <button
          type="button"
          onClick={() => onAction('view_oblique')}
          title="Vista Inclinada Cinematográfica (45°)"
          aria-label="Vista Inclinada"
          className="w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white transition-colors"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-[8px] font-mono font-medium text-slate-400">3D</span>
        </button>

        <button
          type="button"
          onClick={() => onAction('view_topdown')}
          title="Vista Superior (Nadir / Top-down)"
          aria-label="Vista Superior"
          className="w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-emerald-400" />
          <span className="text-[8px] font-mono font-medium text-slate-400">2D</span>
        </button>

        <button
          type="button"
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          title="Atalhos do Teclado"
          aria-label="Ajuda de Teclado"
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            showKeyboardHelp ? 'bg-[#FF6A1A] text-white' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Controller Box */}
      <div className="bg-[#0E1923]/92 backdrop-blur-md border border-slate-700/60 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2.5 w-[156px]">
        {/* Header with Title and Minimize */}
        <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-700/40">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#FF6A1A]" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase">Câmera 3D</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-200 text-xs p-0.5 rounded transition-colors"
            title={isCollapsed ? 'Expandir controles' : 'Minimizar controles'}
            aria-label="Alternar exibição dos controles de câmera"
          >
            {isCollapsed ? '+' : '−'}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* D-PAD: Pan / Movimentação Linear (Frente, Trás, Lados) */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase">Mover / Translação</span>
              <div className="grid grid-cols-3 gap-1 w-full max-w-[124px]">
                {/* Row 1 */}
                <div />
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('pan_forward')}
                  onTouchStart={() => handleMouseDown('pan_forward')}
                  title="Mover para frente (W ou Seta Cima)"
                  aria-label="Mover câmera para frente"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-[#FF6A1A]/90 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <div />

                {/* Row 2 */}
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('pan_left')}
                  onTouchStart={() => handleMouseDown('pan_left')}
                  title="Mover para a esquerda (A ou Seta Esquerda)"
                  aria-label="Mover câmera para esquerda"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-[#FF6A1A]/90 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-9 flex items-center justify-center rounded-lg bg-slate-900/60 border border-slate-800 text-[9px] font-mono text-slate-400">
                  PAN
                </div>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('pan_right')}
                  onTouchStart={() => handleMouseDown('pan_right')}
                  title="Mover para a direita (D ou Seta Direita)"
                  aria-label="Mover câmera para direita"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-[#FF6A1A]/90 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Row 3 */}
                <div />
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('pan_backward')}
                  onTouchStart={() => handleMouseDown('pan_backward')}
                  title="Mover para trás (S ou Seta Baixo)"
                  aria-label="Mover câmera para trás"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-[#FF6A1A]/90 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div />
              </div>
            </div>

            {/* Rotation & Tilt Controls (Girar e Inclinar) */}
            <div className="pt-2 border-t border-slate-700/40 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px] font-medium tracking-wider text-slate-400 uppercase px-0.5">
                <span>Girar</span>
                <span>Inclinar</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('rotate_left')}
                  onTouchStart={() => handleMouseDown('rotate_left')}
                  title="Girar para esquerda / Yaw (Q)"
                  aria-label="Girar câmera para esquerda"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-cyan-600 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400 hover:text-white" />
                </button>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('rotate_right')}
                  onTouchStart={() => handleMouseDown('rotate_right')}
                  title="Girar para direita / Yaw (E)"
                  aria-label="Girar câmera para direita"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-cyan-600 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <RotateCw className="w-4 h-4 text-cyan-400 hover:text-white" />
                </button>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('tilt_up')}
                  onTouchStart={() => handleMouseDown('tilt_up')}
                  title="Inclinar para cima / Pitch (R)"
                  aria-label="Inclinar câmera para cima"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ArrowUp className="w-4 h-4 text-emerald-400 hover:text-white" />
                </button>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown('tilt_down')}
                  onTouchStart={() => handleMouseDown('tilt_down')}
                  title="Inclinar para baixo / Pitch (F)"
                  aria-label="Inclinar câmera para baixo"
                  className="h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
                >
                  <ArrowDown className="w-4 h-4 text-emerald-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Zoom Controls (+ / -) */}
            <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onMouseDown={() => handleMouseDown('zoom_in')}
                onTouchStart={() => handleMouseDown('zoom_in')}
                title="Aproximar / Zoom In (+)"
                aria-label="Aproximar visualização"
                className="flex-1 h-9 flex items-center justify-center gap-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono">Zoom +</span>
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown('zoom_out')}
                onTouchStart={() => handleMouseDown('zoom_out')}
                title="Afastar / Zoom Out (-)"
                aria-label="Afastar visualização"
                className="flex-1 h-9 flex items-center justify-center gap-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
              >
                <Minus className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono">Zoom -</span>
              </button>
            </div>

            {/* Live Camera Metrics */}
            <div className="pt-1.5 border-t border-slate-700/40 flex items-center justify-between text-[9px] font-mono text-slate-400 px-1">
              <span>HDG: {Math.round(currentHeading)}°</span>
              <span>PITCH: {Math.round(currentPitch)}°</span>
            </div>
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Overlay Modal / Flyout */}
      {showKeyboardHelp && (
        <div className="bg-[#0E1923]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl w-64 text-xs text-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-[#FF6A1A]" />
              Atalhos de Navegação
            </span>
            <button
              type="button"
              onClick={() => setShowKeyboardHelp(false)}
              className="text-slate-400 hover:text-white text-base leading-none"
              aria-label="Fechar ajuda de atalhos"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/40">
              <span className="text-slate-400">Mover</span>
              <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-slate-700">W A S D</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/40">
              <span className="text-slate-400">Girar</span>
              <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-slate-700">Q / E</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/40">
              <span className="text-slate-400">Inclinar</span>
              <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-slate-700">R / F</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/40">
              <span className="text-slate-400">Zoom</span>
              <kbd className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-purple-400 border border-slate-700">+ / -</kbd>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            <p>• <strong>Mouse:</strong> Botão esquerdo arrasta (pan/órbita), roda do mouse dá zoom.</p>
            <p>• <strong>Botão direito:</strong> Inclina e rotaciona livremente.</p>
            <p>• <strong>Toque:</strong> Arraste com 1 dedo para mover; 2 dedos para pinçar zoom ou rotacionar.</p>
          </div>
        </div>
      )}
    </div>
  );
};
