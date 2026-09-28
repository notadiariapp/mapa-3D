import React, { useState } from 'react';
import { Code2, Copy, Check, X, ExternalLink, Terminal } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://seu-dominio.com';

  const iframeSnippet = `<iframe 
  src="${currentUrl}" 
  width="100%" 
  height="750px" 
  style="border: none; border-radius: 16px; overflow: hidden;"
  allow="accelerometer; gyroscope; fullscreen"
  title="Mapa 3D Interativo Aracruz"
></iframe>`;

  const reactSnippet = `// 1. Inclua no index.html:
// <link rel="stylesheet" href="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Widgets/widgets.css" />
// <script src="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Cesium.js"></script>

// 2. Importe o componente no seu site React/Antigravity:
import { CesiumViewer } from './components/Map3D/CesiumViewer';

export function SecaoMapa() {
  return (
    <section id="mapa-estrategico" className="w-full h-[800px] relative">
      <CesiumViewer className="w-full h-full rounded-2xl" />
    </section>
  );
}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0E1923] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF6A1A]/20 text-[#FF6A1A]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Como Inserir no Seu Site (Antigravity)</h3>
              <p className="text-xs text-slate-400">Escolha o formato ideal para a sua aplicação</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: IFRAME */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">1</span>
              Incorporação Rápida via iFrame (Qualquer Site / HTML / Antigravity)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(iframeSnippet, 'iframe')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedType === 'iframe' ? 'Copiado!' : 'Copiar iFrame'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
            {iframeSnippet}
          </pre>
        </div>

        {/* Option 2: REACT COMPONENT */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FF6A1A]/20 text-[#FF6A1A] flex items-center justify-center text-[10px] font-bold">2</span>
              Uso Direto como Componente React no Projeto
            </span>
            <button
              type="button"
              onClick={() => handleCopy(reactSnippet, 'react')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-[#FF6A1A] flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedType === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedType === 'react' ? 'Copiado!' : 'Copiar Código'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
            {reactSnippet}
          </pre>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <p>• Os arquivos dos componentes estão isolados em <code className="text-amber-400">src/components/Map3D/</code>.</p>
          <p>• As coordenadas reais e paradas do tour estão organizadas em <code className="text-amber-400">src/data/aracruzData.ts</code>.</p>
          <p>• Você pode rodar em tela cheia ou ajustar as dimensões pelo container pai.</p>
        </div>
      </div>
    </div>
  );
};
