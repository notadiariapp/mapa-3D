/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CesiumViewer } from './components/Map3D/CesiumViewer';
import { EmbedModal } from './components/EmbedModal';
import { Code2, Compass, ShieldCheck, Maximize, ExternalLink } from 'lucide-react';

export default function App() {
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  return (
    <main
      id="mapa-estrategico"
      className="relative w-screen h-screen overflow-hidden bg-[#0A1118] text-slate-100 font-sans select-none"
    >
      {/* 3D Map Standalone Viewport */}
      <CesiumViewer className="w-full h-full" />

      {/* Floating Minimal Brand Badge (Top-Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0E1923]/92 backdrop-blur-xl border border-slate-700/70 shadow-2xl">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF6A1A] to-[#FF843D] flex items-center justify-center font-display font-black text-white text-xs shadow-md shadow-[#FF6A1A]/30">
          03
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-white text-xs tracking-wider">
            ÁREA 03 · ARACRUZ 3D
          </span>
          <span className="text-[9px] font-mono uppercase bg-[#FF6A1A]/20 text-[#FF6A1A] border border-[#FF6A1A]/40 px-1.5 py-0.5 rounded font-bold">
            ES · &lt;10KM PORTOS
          </span>
        </div>
      </div>

      {/* Floating Integration & Embed Button (Bottom-Right) */}
      <div className="absolute bottom-5 right-5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsEmbedModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#0E1923]/95 hover:bg-slate-800 border border-slate-700/80 hover:border-[#FF6A1A]/60 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 shadow-2xl transition-all duration-200 backdrop-blur-md active:scale-95 group"
          title="Ver código para inserir no seu site Antigravity"
        >
          <Code2 className="w-4 h-4 text-[#FF6A1A] group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Inserir no seu site</span>
          <span className="md:hidden">Embed</span>
        </button>
      </div>

      {/* Embed Code Helper Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </main>
  );
}
