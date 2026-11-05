import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  Check,
  Copy,
  FileJson,
  Terminal,
  Monitor,
  RotateCcw,
} from 'lucide-react';
import { MetaComposition, INITIAL_META_COMPOSITIONS } from '../data/metaComps';

interface DesktopExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  compositions: MetaComposition[];
  onUpdateCompositions: (newComps: MetaComposition[]) => void;
}

export const DesktopExportModal: React.FC<DesktopExportModalProps> = ({
  isOpen,
  onClose,
  compositions,
  onUpdateCompositions,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'exe_python' | 'second_screen'>('json');
  const [jsonText, setJsonText] = useState<string>(() =>
    JSON.stringify(compositions, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setJsonError('El JSON debe ser un arreglo no vacío de composiciones.');
        return;
      }
      setJsonError(null);
      onUpdateCompositions(parsed);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setJsonError(
        err instanceof Error ? `Error de sintaxis JSON: ${err.message}` : 'JSON inválido'
      );
    }
  };

  const handleResetDefault = () => {
    const formatted = JSON.stringify(INITIAL_META_COMPOSITIONS, null, 2);
    setJsonText(formatted);
    setJsonError(null);
    onUpdateCompositions(INITIAL_META_COMPOSITIONS);
  };

  const handleDownloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pythonDesktopCode = `# tft_overlay_desktop.py
# Asistente de Combate & Overlay de Segunda Pantalla para TFT (Empaquetable a .EXE)
# Requisitos: pip install customtkinter pywebview pyinstaller

import json
import os
import sys
import customtkinter as ctk

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")

def resource_path(relative_path):
    """Obtiene la ruta del JSON tanto en desarrollo como dentro del .exe de PyInstaller"""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class TFTTacticalOverlayApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("TFT Tactical Overlay — Asistente de 2da Pantalla")
        self.geometry("1280x820")
        self.configure(fg_color="#0B0F17")
        self.always_on_top = False

        # Cargar meta_comps.json modular
        self.comps = self.load_meta_json()
        self.selected_early = set()

        # Barra superior
        header = ctk.CTkFrame(self, fg_color="#131B2E", corner_radius=8)
        header.pack(fill="x", padx=12, pady=10)

        title_lbl = ctk.CTkLabel(
            header,
            text="TFT TACTICAL OVERLAY — DECISIÓN EN < 5 SEGUNDOS",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#F59E0B"
        )
        title_lbl.pack(side="left", padx=14, pady=10)

        pin_btn = ctk.CTkButton(
            header,
            text="Fijar Siempre Visible (Topmost)",
            fg_color="#1E293B",
            hover_color="#334155",
            command=self.toggle_topmost
        )
        pin_btn.pack(side="right", padx=14, pady=10)

        # Contenedor desplazable de tarjetas de composición
        self.scroll = ctk.CTkScrollableFrame(self, fg_color="#0B0F17")
        self.scroll.pack(fill="both", expand=True, padx=12, pady=6)
        self.render_compositions()

    def toggle_topmost(self):
        self.always_on_top = not self.always_on_top
        self.attributes("-topmost", self.always_on_top)

    def load_meta_json(self):
        path = resource_path("meta_comps.json")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def render_compositions(self):
        for widget in self.scroll.winfo_children():
            widget.destroy()

        for comp in self.comps:
            card = ctk.CTkFrame(self.scroll, fg_color="#131B2E", corner_radius=10, border_width=1, border_color="#1E293B")
            card.pack(fill="x", padx=6, pady=8)

            top_text = f"[TIER {comp.get('tier')}] {comp.get('nombre')}  ·  {comp.get('arquetipo')}  ·  Daño {comp.get('estiloDano')}"
            ctk.CTkLabel(card, text=top_text, font=ctk.CTkFont(size=16, weight="bold"), text_color="#F8FAFC").pack(anchor="w", padx=14, pady=(12, 4))

            pivot = comp.get("transicion_pivot", {})
            pivot_lbl = f"⚡ PIVOT ({pivot.get('momento')}): {pivot.get('alerta_texto')}"
            ctk.CTkLabel(card, text=pivot_lbl, font=ctk.CTkFont(size=13, weight="bold"), text_color="#F59E0B").pack(anchor="w", padx=14, pady=2)

            early = comp.get("early_game", {})
            lvl_str = f"Lvl 4: {', '.join(early.get('lvl_4', []))}  |  Lvl 5: {', '.join(early.get('lvl_5', []))}  |  Lvl 6: {', '.join(early.get('lvl_6', []))}  |  Lvl 7: {', '.join(early.get('lvl_7', []))}"
            ctk.CTkLabel(card, text=lvl_str, font=ctk.CTkFont(size=12), text_color="#94A3B8").pack(anchor="w", padx=14, pady=2)

            tip = f"💡 Condición de Victoria: {comp.get('consejo_rapido')}"
            ctk.CTkLabel(card, text=tip, font=ctk.CTkFont(size=12), text_color="#34D399").pack(anchor="w", padx=14, pady=(2, 12))

if __name__ == "__main__":
    app = TFTTacticalOverlayApp()
    app.mainloop()
`;

  const buildExeCommands = `# 1. Instalar dependencias en Windows (CMD o PowerShell)
pip install customtkinter pyinstaller

# 2. Colocar 'tft_overlay_desktop.py' y 'meta_comps.json' en la misma carpeta

# 3. Compilar a un único ejecutable .EXE sin consola negra de fondo:
pyinstaller --noconsole --onefile --add-data "meta_comps.json;." --name "TFT_Tactical_Overlay" tft_overlay_desktop.py

# El archivo final estará listo en: dist/TFT_Tactical_Overlay.exe`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-[#131B2E] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-100">
              Gestión Modular del Meta (JSON) y Compilación a .EXE Desktop
            </h2>
            <p className="text-xs text-slate-400">
              Actualiza las composiciones cuando cambie el parche o descarga el empaquetado `.exe` para Windows.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#0E1422] border-b border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'json'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4" />
            1. Archivo Modular meta_comps.json (En Vivo)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exe_python')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'exe_python'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            2. Compilar a .EXE en Windows (Python / PyInstaller)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('second_screen')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'second_screen'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            3. Modo Ventana Nativa Sin Bordes (2da Pantalla)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Edita directamente las composiciones del parche actual o importa un archivo{' '}
                  <code className="font-mono text-amber-300">meta_comps.json</code>. La interfaz se actualiza al instante.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-700 text-xs font-medium text-slate-200 hover:border-amber-400 cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    Importar .JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        'meta_comps.json',
                        jsonText,
                        'application/json'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-700 text-xs font-medium text-slate-200 hover:border-amber-400 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    Descargar meta_comps.json
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-700 text-xs font-medium text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Meta Base
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-xs text-rose-200">
                  {jsonError}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-xs text-emerald-200">
                  ¡Composiciones actualizadas en vivo correctamente!
                </div>
              )}

              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={15}
                spellCheck={false}
                className="w-full rounded-xl bg-[#0B0F17] border border-slate-800 p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyJson}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Aplicar Cambios al Overlay en Tiempo Real
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exe_python' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-100">
                    Script Completo en Python (CustomTkinter) + Instrucciones PyInstaller
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lee el mismo archivo <code className="font-mono text-amber-300">meta_comps.json</code> para que nunca tengas que recompilar cuando cambie el parche.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        'tft_overlay_desktop.py',
                        pythonDesktopCode,
                        'text/x-python'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar tft_overlay_desktop.py
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard('py', pythonDesktopCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-700 text-xs text-slate-200 hover:border-slate-500 cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'py' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedKey === 'py' ? 'Copiado' : 'Copiar Código Python'}
                  </button>
                </div>
              </div>

              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    PASOS PARA GENERAR EL ARCHIVO .EXE EN WINDOWS
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('cmd', buildExeCommands)}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'cmd' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copiar comandos
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {buildExeCommands}
                </pre>
              </div>

              <pre className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-64">
                {pythonDesktopCode}
              </pre>
            </div>
          )}

          {activeTab === 'second_screen' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-display font-bold text-amber-300">
                  Opción Recomendada: Ejecutar esta Interfaz Completa como App de Escritorio Ligera (.BAT / Acceso Directo)
                </h3>
                <p>
                  Puedes lanzar esta misma aplicación visual interactiva (con todos los íconos oficiales, tablero hexagonal 4×7 y filtro de campeones en tiempo real) en tu segundo monitor sin barra de direcciones ni pestañas de navegador creando un archivo{' '}
                  <code className="font-mono text-white">Iniciar_TFT_Overlay.bat</code> en tu Escritorio con esta línea:
                </p>
                <pre className="bg-[#131B2E] border border-slate-700 rounded-lg p-3 font-mono text-emerald-300 overflow-x-auto">
                  {`start msedge.exe --app="${window.location.origin}" --window-size=1440,900`}
                </pre>
                <p className="text-slate-400">
                  Esto abre el asistente como una ventana nativa independiente con consumo mínimo de RAM y GPU mientras juegas Teamfight Tactics en pantalla completa sin bordes en el monitor principal.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
