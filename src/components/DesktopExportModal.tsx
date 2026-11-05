import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  Check,
  Copy,
  FileJson,
  Terminal,
  Globe,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { MetaComposition, INITIAL_META_COMPOSITIONS } from '../data/metaComps';

interface DesktopExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  compositions: MetaComposition[];
  onUpdateCompositions: (newComps: MetaComposition[]) => void;
  initialTab?: 'live_bridge' | 'github_pages' | 'json' | 'exe_python';
}

export const DesktopExportModal: React.FC<DesktopExportModalProps> = ({
  isOpen,
  onClose,
  compositions,
  onUpdateCompositions,
  initialTab = 'live_bridge',
}) => {
  const [activeTab, setActiveTab] = useState<
    'live_bridge' | 'github_pages' | 'json' | 'exe_python'
  >(initialTab);
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

  const liveBridgePythonCode = `# tft_live_bridge.py
# Puente Local Oficial para conectar tu partida de TFT (Riot Live Client API 127.0.0.1:2999)
# con la Página Web de GitHub Pages o el Overlay en Tiempo Real.
# Ejecutar con: python tft_live_bridge.py

import json
import ssl
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer

RIOT_LIVE_URL = "https://127.0.0.1:2999/liveclientdata/allgamedata"

# Ignorar el certificado autofirmado local de Riot Games en 127.0.0.1:2999
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def map_game_seconds_to_tft_stage(seconds: float):
    """Convierte el tiempo real de partida de Riot en la Fase y Nivel de TFT"""
    if seconds < 190:
        return {"level": "lvl_4", "stage": "Fase 2-1", "inGame": True, "seconds": int(seconds)}
    elif seconds < 360:
        return {"level": "lvl_5", "stage": "Fase 2-5", "inGame": True, "seconds": int(seconds)}
    elif seconds < 580:
        return {"level": "lvl_6", "stage": "Fase 3-2", "inGame": True, "seconds": int(seconds)}
    elif seconds < 780:
        return {"level": "lvl_7", "stage": "Fase 4-1", "inGame": True, "seconds": int(seconds)}
    else:
        return {"level": "lvl_8", "stage": "Fase 4-2+ (Pivot)", "inGame": True, "seconds": int(seconds)}

class BridgeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/status"):
            payload = {"inGame": False, "level": "lvl_4", "stage": "Esperando partida...", "seconds": 0}
            try:
                req = urllib.request.Request(RIOT_LIVE_URL)
                with urllib.request.urlopen(req, context=ssl_ctx, timeout=1.2) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    game_time = float(data.get("gameData", {}).get("gameTime", 0))
                    summoner = data.get("activePlayer", {}).get("summonerName", "Jugador")
                    payload = map_game_seconds_to_tft_stage(game_time)
                    payload["summonerName"] = summoner
            except Exception:
                pass

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        return  # Silenciar consola

if __name__ == "__main__":
    print("=== PUENTE LOCAL TFT ACTIVO EN http://127.0.0.1:5123/status ===")
    print("Detectando cliente de Riot Games (127.0.0.1:2999) automaticamente...")
    server = HTTPServer(("127.0.0.1", 5123), BridgeHandler)
    server.serve_forever()
`;

  const githubPagesCommands = `# 1. Inicializa Git y sube este proyecto a un repositorio en tu cuenta de GitHub:
git init
git add .
git commit -m "Deploy TFT Tactical Overlay"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tft-tactical-overlay.git
git push -u origin main

# 2. Activa GitHub Pages en tu repositorio (solo se hace una vez):
# Ve a tu repositorio en GitHub -> Settings -> Pages
# En "Build and deployment" -> "Source", elige: "GitHub Actions"
# ¡Listo! El archivo .github/workflows/deploy.yml incluido en este proyecto
# compilará y publicará automáticamente tu web en:
# https://TU_USUARIO.github.io/tft-tactical-overlay/`;

  const pythonDesktopCode = `# tft_overlay_desktop.py
# Asistente de Combate & Overlay de Segunda Pantalla para TFT (Empaquetable a .EXE)
# Además detecta automáticamente la partida de Riot en https://127.0.0.1:2999
# Requisitos: pip install customtkinter pyinstaller

import json
import os
import sys
import ssl
import urllib.request
import customtkinter as ctk

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class TFTTacticalOverlayApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("TFT Tactical Overlay — Auto-Detector de Partida")
        self.geometry("1280x820")
        self.configure(fg_color="#0B0F17")
        self.always_on_top = False
        self.comps = self.load_meta_json()

        header = ctk.CTkFrame(self, fg_color="#131B2E", corner_radius=8)
        header.pack(fill="x", padx=12, pady=10)

        self.status_lbl = ctk.CTkLabel(
            header,
            text="TFT OVERLAY · Buscando partida en Riot Client (127.0.0.1:2999)...",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#F59E0B"
        )
        self.status_lbl.pack(side="left", padx=14, pady=10)

        pin_btn = ctk.CTkButton(
            header,
            text="Fijar Siempre Visible (Topmost)",
            fg_color="#1E293B",
            hover_color="#334155",
            command=self.toggle_topmost
        )
        pin_btn.pack(side="right", padx=14, pady=10)

        self.scroll = ctk.CTkScrollableFrame(self, fg_color="#0B0F17")
        self.scroll.pack(fill="both", expand=True, padx=12, pady=6)
        self.render_compositions("lvl_4")
        self.poll_riot_client()

    def toggle_topmost(self):
        self.always_on_top = not self.always_on_top
        self.attributes("-topmost", self.always_on_top)

    def load_meta_json(self):
        path = resource_path("meta_comps.json")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def poll_riot_client(self):
        try:
            req = urllib.request.Request("https://127.0.0.1:2999/liveclientdata/allgamedata")
            with urllib.request.urlopen(req, context=ssl_ctx, timeout=1.0) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                secs = float(data.get("gameData", {}).get("gameTime", 0))
                lvl = "lvl_4" if secs < 190 else "lvl_5" if secs < 360 else "lvl_6" if secs < 580 else "lvl_7" if secs < 780 else "lvl_8"
                self.status_lbl.configure(text=f"🟢 PARTIDA EN VIVO ({int(secs//60)}m {int(secs%60)}s) — Mostrando mesa de {lvl.upper()}", text_color="#34D399")
        except Exception:
            pass
        self.after(4000, self.poll_riot_client)

    def render_compositions(self, active_lvl):
        for widget in self.scroll.winfo_children():
            widget.destroy()
        for comp in self.comps:
            card = ctk.CTkFrame(self.scroll, fg_color="#131B2E", corner_radius=10, border_width=1, border_color="#1E293B")
            card.pack(fill="x", padx=6, pady=8)
            top_text = f"[TIER {comp.get('tier')}] {comp.get('nombre')}  ·  {comp.get('arquetipo')}  ·  Daño {comp.get('estiloDano')}"
            ctk.CTkLabel(card, text=top_text, font=ctk.CTkFont(size=16, weight="bold"), text_color="#F8FAFC").pack(anchor="w", padx=14, pady=(12, 4))
            pivot = comp.get("transicion_pivot", {})
            ctk.CTkLabel(card, text=f"⚡ PIVOT ({pivot.get('momento')}): {pivot.get('alerta_texto')}", font=ctk.CTkFont(size=13, weight="bold"), text_color="#F59E0B").pack(anchor="w", padx=14, pady=2)
            early = comp.get("early_game", {})
            lvl_str = f"Lvl 4: {', '.join(early.get('lvl_4', []))}  |  Lvl 5: {', '.join(early.get('lvl_5', []))}  |  Lvl 6: {', '.join(early.get('lvl_6', []))}  |  Lvl 7: {', '.join(early.get('lvl_7', []))}"
            ctk.CTkLabel(card, text=lvl_str, font=ctk.CTkFont(size=12), text_color="#94A3B8").pack(anchor="w", padx=14, pady=(2, 12))

if __name__ == "__main__":
    app = TFTTacticalOverlayApp()
    app.mainloop()
`;

  const buildExeCommands = `pip install customtkinter pyinstaller
pyinstaller --noconsole --onefile --add-data "meta_comps.json;." --name "TFT_Tactical_Overlay" tft_overlay_desktop.py`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-[#131B2E] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-100">
              Detección de Juego en Vivo, GitHub Pages y Empaquetado .EXE
            </h2>
            <p className="text-xs text-slate-400">
              Conecta la web con tu cliente de Riot Games (`127.0.0.1:2999`), publícala en GitHub Pages o edita el JSON.
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
            onClick={() => setActiveTab('live_bridge')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'live_bridge'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            1. ¿Cómo Detecta mi Partida de TFT?
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github_pages')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'github_pages'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            2. Publicar en GitHub Pages
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'json'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4" />
            3. Editar meta_comps.json
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exe_python')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'exe_python'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#131B2E] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            4. Compilar a .EXE Nativo
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'live_bridge' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="text-sm font-display font-bold text-amber-300">
                  ¿Cómo sabe la aplicación en qué fase o ronda de TFT estás? (2 Métodos)
                </h3>
                <p>
                  Cuando entras a una partida de League of Legends / TFT, el cliente de Riot Games abre automáticamente en tu PC un servidor local en{' '}
                  <code className="font-mono text-emerald-300">https://127.0.0.1:2999/liveclientdata/allgamedata</code>{' '}
                  que entrega en tiempo real el segundo exacto de la partida (<code className="font-mono text-white">gameTime</code>) y tu nombre de invocador.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#131B2E] border border-slate-800">
                    <div className="font-bold text-slate-100 mb-1">
                      Método A: 100% Web sin instalar nada (Reloj Oficial 2-1)
                    </div>
                    <p className="text-slate-400">
                      Si abres la web desde GitHub Pages en tu 2da pantalla o tablet, pulsa el botón{' '}
                      <strong className="text-emerald-300">"Iniciar Reloj en Fase 2-1"</strong> en la barra superior apenas comience la ronda 2-1. Como las rondas y carruseles de TFT tienen tiempos fijos, la página cambiará sola de Nivel 4 → 5 → 6 → 7 → 8.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#131B2E] border border-amber-500/40">
                    <div className="font-bold text-amber-300 mb-1">
                      Método B: Detección Automática del Cliente Riot (Puente Local)
                    </div>
                    <p className="text-slate-300">
                      Por seguridad, los navegadores bloquean el certificado autofirmado de <code className="font-mono">127.0.0.1:2999</code>. Descarga y ejecuta este micro-script ligero (<code className="font-mono text-amber-300">tft_live_bridge.py</code>, no requiere librerías externas): lee el cliente de Riot y le avisa automáticamente a esta página web en qué fase estás.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">
                  Script Puente Local (`tft_live_bridge.py` — 0 dependencias externas, usa Python estándar):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        'tft_live_bridge.py',
                        liveBridgePythonCode,
                        'text/x-python'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar tft_live_bridge.py
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('bridge', liveBridgePythonCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-700 text-xs text-slate-200 hover:border-slate-500 cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'bridge' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedKey === 'bridge' ? 'Copiado' : 'Copiar Script'}
                  </button>
                </div>
              </div>

              <pre className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-56">
                {liveBridgePythonCode}
              </pre>
            </div>
          )}

          {activeTab === 'github_pages' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="text-sm font-display font-bold text-amber-300">
                  Este proyecto ya está preconfigurado para GitHub Pages
                </h3>
                <p>
                  Ya hemos configurado <code className="font-mono text-emerald-300">base: './'</code> en <code className="font-mono text-white">vite.config.ts</code> y hemos creado el flujo automático <code className="font-mono text-emerald-300">.github/workflows/deploy.yml</code>. Solo necesitas subir el código a un repositorio de GitHub y se publicará gratis en tu URL <code className="font-mono text-amber-300">https://tu-usuario.github.io/nombre-repo/</code>.
                </p>
              </div>

              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    COMANDOS PARA SUBIR Y PUBLICAR EN GITHUB PAGES
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('gh', githubPagesCommands)}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'gh' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copiar comandos
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {githubPagesCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Edita directamente las composiciones del parche actual o importa un archivo{' '}
                  <code className="font-mono text-amber-300">meta_comps.json</code>.
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
                rows={13}
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
                    App Desktop en Python (CustomTkinter) con Auto-Detección 127.0.0.1:2999
                  </h3>
                  <p className="text-xs text-slate-400">
                    Al ser un ejecutable <code className="font-mono text-amber-300">.exe</code> nativo en tu PC, lee directamente el cliente de Riot Games sin bloqueos de navegador.
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
                    COMANDOS PARA GENERAR EL ARCHIVO .EXE EN WINDOWS
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

              <pre className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-52">
                {pythonDesktopCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
