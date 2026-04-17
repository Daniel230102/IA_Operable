/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  FileCode, 
  Terminal, 
  Cpu, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Network,
  Database,
  ArrowRight,
  Play,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  ChevronRight,
  Lock,
  Eye,
  Zap,
  Globe,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- Mock Data for Charts ---

const CHART_DATA = [
  { time: '00:00', value: 400, errors: 24 },
  { time: '04:00', value: 300, errors: 13 },
  { time: '08:00', value: 900, errors: 98 },
  { time: '12:00', value: 1200, errors: 45 },
  { time: '16:00', value: 1100, errors: 32 },
  { time: '20:00', value: 800, errors: 30 },
  { time: '23:59', value: 600, errors: 15 },
];

const DISTRIBUTION_DATA = [
  { name: 'crear_tarea', value: 450 },
  { name: 'actualizar_cliente', value: 300 },
  { name: 'enviar_email', value: 200 },
  { name: 'nada', value: 50 },
];

// --- Types & Constants ---

type Tab = 'overview' | 'contracts' | 'execution' | 'topology' | 'settings';

const CONTRACT_INPUT = {
  tipo_accion: "crear_tarea | actualizar_cliente | enviar_email | nada",
  datos: {
    id_cliente: "string (ej: CLI-XXXXX)",
    titulo: "string (opcional)",
    prioridad: "baja | media | alta"
  },
  metadatos: {
    trace_id: "string",
    origin: "string"
  }
};

const CONTRACT_OUTPUT = {
  estatus: "ejecutado | no_ejecutado | rechazado",
  mensaje: "string",
  datos: {
    id_accion: "string",
    tipo_accion: "string"
  },
  metadatos: {
    trace_id: "string"
  }
};

// --- Helper Components ---

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'neutral' | 'success' | 'warning' | 'error' | 'indigo' }) => {
  const styles = {
    neutral: 'bg-enterprise-800 text-slate-400 border-enterprise-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [playgroundInput, setPlaygroundInput] = useState(JSON.stringify({
    tipo_accion: "crear_tarea",
    id_cliente: "CLI-99887",
    prioridad: "alta",
    trace_id: "TEST-TRACE-001",
    origin: "playground"
  }, null, 2));
  
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [liveKpi, setLiveKpi] = useState({ flow: 124, errors: 3 });

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveKpi(prev => ({
        flow: prev.flow + (Math.random() > 0.5 ? 1 : -1),
        errors: Math.max(0, prev.errors + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTestContract = () => {
    setIsValidating(true);
    setPlaygroundResult(null);
    
    setTimeout(() => {
      try {
        const parsed = JSON.parse(playgroundInput);
        const hasRequired = parsed.tipo_accion && parsed.id_cliente && parsed.trace_id;
        const validAction = ["crear_tarea", "actualizar_cliente", "enviar_email", "nada"].includes(parsed.tipo_accion);
        
        if (hasRequired && validAction) {
          setPlaygroundResult({
            estatus: "ejecutado",
            mensaje: "Contrato validado correctamente por el Core.",
            id_accion: "ACC-" + Math.floor(Math.random() * 90000 + 10000),
            trace_id: parsed.trace_id
          });
        } else {
          setPlaygroundResult({
            estatus: "rechazado",
            mensaje: !hasRequired ? "Error: Faltan campos obligatorios." : "Error: tipo_accion no reconocido.",
            trace_id: parsed.trace_id || "ERR-001"
          });
        }
      } catch (e) {
        setPlaygroundResult({
          estatus: "rechazado",
          mensaje: "Error: JSON mal formado.",
          trace_id: "ERR-JSON"
        });
      }
      setIsValidating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-enterprise-950 text-slate-200 selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1c212b_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="w-20 border-r border-enterprise-800 flex flex-col items-center py-8 gap-8 bg-enterprise-900/40 backdrop-blur-xl sticky top-0 h-screen z-50">
        <motion.div 
          whileHover={{ rotate: 180 }}
          className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <Cpu className="text-white w-7 h-7" />
        </motion.div>
        
        <div className="flex flex-col gap-5">
          <NavItem icon={<BarChart3 size={22} />} id="overview" active={activeTab} onClick={setActiveTab} label="Dashboard" />
          <NavItem icon={<FileCode size={22} />} id="contracts" active={activeTab} onClick={setActiveTab} label="Contracts" />
          <NavItem icon={<Terminal size={22} />} id="execution" active={activeTab} onClick={setActiveTab} label="Playground" />
          <NavItem icon={<Network size={22} />} id="topology" active={activeTab} onClick={setActiveTab} label="Topology" />
        </div>

        <div className="mt-auto flex flex-col gap-5">
          <NavItem icon={<SettingsIcon size={22} />} id="settings" active={activeTab} onClick={setActiveTab} label="Settings" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 border-b border-enterprise-800 flex items-center justify-between px-10 bg-enterprise-900/20 sticky top-0 z-40 backdrop-blur-sm">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-0.5">Architect Node</span>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                CORE-ALPHA-01 <ChevronRight size={16} className="text-enterprise-700" /> 
                <span className="text-slate-400 font-medium capitalize">{activeTab}</span>
              </h1>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 border-l border-enterprise-700 pl-10">
              <div className="flex items-center gap-2">
                <Search size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Trace ID Search...</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-enterprise-800/50 px-3 py-1.5 rounded-full border border-enterprise-700">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400">{liveKpi.flow} tx/m</span>
              </div>
              <div className="w-px h-3 bg-enterprise-700" />
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-400" />
                <span className="text-[11px] font-bold text-rose-400">{liveKpi.errors} err/m</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-enterprise-700 overflow-hidden border border-enterprise-600">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tighter text-white">Seguridad Determinista <br/><span className="text-indigo-500">en Tiempo Real.</span></h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                      El Contract Architect garantiza que ninguna acción de IA toque tus sistemas sin una validación binaria previa. Cero alucinaciones en la ejecución.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setActiveTab('execution')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                        <Play size={16} /> Abrir Playground
                      </button>
                      <button className="border border-enterprise-700 hover:border-enterprise-600 text-slate-300 px-6 py-2.5 rounded-lg font-bold text-sm transition-all">
                        Documentación SDK
                      </button>
                    </div>
                  </div>
                  <div className="glass-panel p-6 border-indigo-500/20 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-6">
                      <ShieldCheck className="text-indigo-400" size={32} />
                      <Badge variant="success">Secured</Badge>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Audit Score</span>
                    <div className="text-5xl font-bold text-white tracking-tighter">99.2</div>
                    <div className="w-full bg-enterprise-800 h-1.5 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "99.2%" }}
                        className="bg-indigo-500 h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Throughput Validado" value="2.4M" unit="TX" trend="+12%" />
                  <StatCard title="Uptime del Core" value="99.99" unit="%" trend="0.0%" />
                  <StatCard title="Latencia Media" value="12" unit="ms" trend="-2ms" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-panel p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-bold flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-400" /> Rendimiento de Validación
                      </h3>
                      <div className="flex gap-2">
                         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-[10px] text-slate-500 font-bold uppercase">Tráfico</span></div>
                         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-[10px] text-slate-500 font-bold uppercase">Errores</span></div>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1c212b" vertical={false} />
                          <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#11141a', border: '1px solid #2d3545', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '11px' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                          <Area type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-panel p-8">
                    <h3 className="font-bold mb-8 flex items-center gap-2">
                        <Globe size={18} className="text-emerald-400" /> Distribución de Acciones
                    </h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={DISTRIBUTION_DATA} layout="vertical">
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} width={100} tickLine={false} axisLine={false} />
                           <Tooltip 
                             cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                             contentStyle={{ backgroundColor: '#11141a', border: '1px solid #2d3545', borderRadius: '8px' }}
                             itemStyle={{ fontSize: '11px' }}
                           />
                           <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-center text-slate-500 font-bold uppercase mt-4">Top Acciones Solicitadas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Zap size={18} className="text-amber-400" /> Eventos Recientes
                    </h3>
                    <div className="space-y-4">
                      <LogEntry status="success" msg="CLI-90122: crear_tarea (validado)" time="2s ago" />
                      <LogEntry status="error" msg="CLI-INVALID: Fallo en id_cliente (bloqueado)" time="14s ago" />
                      <LogEntry status="success" msg="CLI-44321: enviar_email (validado)" time="1m ago" />
                      <LogEntry status="success" msg="CLI-11223: nada (no_action)" time="3m ago" />
                    </div>
                  </div>
                  
                  <div className="glass-panel p-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Network size={120} />
                     </div>
                     <h3 className="text-lg font-bold mb-6">Estado de la Red de Agentes</h3>
                     <div className="space-y-6">
                        <AgentStatus name="Agente Comercial" status="online" load={45} />
                        <AgentStatus name="Agente de Soporte" status="online" load={82} />
                        <AgentStatus name="Agente Auditor" status="idle" load={2} />
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contracts' && (
              <motion.div 
                key="contracts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Definición de Protocolos</h2>
                    <p className="text-slate-400 text-sm mt-1 text-slate-500 font-medium">v2.4.0 (Enterprise Gold Standard)</p>
                  </div>
                  <button className="bg-enterprise-800 hover:bg-enterprise-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                    <RefreshCw size={14} /> Refrescar Esquemas
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Ingress Contract (Input)</h3>
                      </div>
                      <Badge variant="indigo">Strict</Badge>
                    </div>
                    <div className="mono-card border-indigo-500/10 min-h-[400px]">
                      <pre className="text-indigo-400/90 leading-relaxed text-xs">
                        {JSON.stringify(CONTRACT_INPUT, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Egress Contract (Output)</h3>
                      </div>
                      <Badge variant="success">Validated</Badge>
                    </div>
                    <div className="mono-card border-emerald-500/10 min-h-[400px]">
                      <pre className="text-emerald-400/90 leading-relaxed text-xs">
                        {JSON.stringify(CONTRACT_OUTPUT, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'execution' && (
              <motion.div 
                key="execution"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full gap-8"
              >
                <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-bold flex items-center gap-4">
                     Contract Playground
                     <Badge variant="warning">Live Debug</Badge>
                   </h2>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setPlaygroundInput(JSON.stringify(CONTRACT_INPUT, null, 2))}
                        className="text-xs font-bold text-slate-500 hover:text-slate-300"
                      >
                        Resetear Ejemplo
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-enterprise-800 border border-enterprise-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-enterprise-900 p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><Lock size={12} /> INPUT_STREAM.json</span>
                      <button 
                        onClick={handleTestContract}
                        disabled={isValidating}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                      >
                        {isValidating ? <RefreshCw className="animate-spin" size={12} /> : <Play size={12} />} Ejecutar Validación
                      </button>
                    </div>
                    <textarea 
                      value={playgroundInput}
                      onChange={(e) => setPlaygroundInput(e.target.value)}
                      className="w-full h-[400px] bg-black/40 p-6 font-mono text-sm border border-enterprise-700/50 rounded-lg focus:outline-none focus:border-indigo-500/50 text-indigo-400 resize-none"
                    />
                  </div>

                  <div className="bg-enterprise-950 p-6 space-y-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><Eye size={12} /> CORE_EMIT.json</span>
                       {playgroundResult && (
                         <Badge variant={playgroundResult.estatus === 'ejecutado' ? 'success' : 'error'}>
                           {playgroundResult.estatus}
                         </Badge>
                       )}
                    </div>
                    <div className="flex-1 bg-black/60 rounded-lg p-6 font-mono text-sm text-emerald-400 border border-enterprise-700/30 overflow-auto whitespace-pre">
                      {isValidating ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                           <RefreshCw size={32} className="animate-spin text-indigo-500" />
                           <span className="animate-pulse">Analizando contrato contra esquema estricto...</span>
                        </div>
                      ) : playgroundResult ? (
                        JSON.stringify(playgroundResult, null, 2)
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                          Esperando ejecución...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'topology' && (
              <motion.div 
                key="topology"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-12"
              >
                <div className="text-center space-y-4">
                   <h2 className="text-3xl font-bold">Mapa de Topología Segura</h2>
                   <p className="text-slate-500 max-w-xl mx-auto">Visualización del flujo de datos y las capas de securización entre la interfaz de usuario y el núcleo del sistema.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
                   <TopologyNode icon={<Database />} label="Client Data" sub="Raw Input" active />
                   <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 relative">
                      <motion.div 
                        animate={{ x: [0, 200, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
                      />
                   </div>
                   <TopologyNode icon={<ShieldCheck />} label="Validation Core" sub="Schema Check" active highlight />
                   <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500" />
                   <TopologyNode icon={<Cpu />} label="AI Action Engine" sub="Execution" active />
                </div>

                <div className="bg-enterprise-900 border border-enterprise-700 p-8 rounded-2xl w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="text-center">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nodos Conectados</div>
                   </div>
                   <div className="text-center border-l border-enterprise-800">
                      <div className="text-2xl font-bold text-emerald-400">Stable</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Estado Capa 1</div>
                   </div>
                   <div className="text-center border-l border-enterprise-800">
                      <div className="text-2xl font-bold text-indigo-400">Locked</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Estado Capa 2</div>
                   </div>
                   <div className="text-center border-l border-enterprise-800">
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Fugas Detectadas</div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl space-y-8"
              >
                 <h2 className="text-3xl font-bold">Configuración del Nodo</h2>
                 
                 <div className="space-y-6">
                    <SettingItem title="Modo de Validación" desc="Define el nivel de restricción de los esquemas." extra={<Badge variant="error">Strict Only</Badge>} />
                    <SettingItem title="Auditoría Forense" desc="Guardar cada trace_id en el log persistente durante 90 días." extra={<Switch active />} />
                    <SettingItem title="Notificaciones de Error" desc="Enviar alertas críticas a Slack/Email ante fallos de contrato." extra={<Switch />} />
                    
                    <div className="pt-8 flex flex-col gap-4">
                       <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">Guardar Configuración</button>
                       <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold py-3 rounded-xl transition-all border border-rose-500/20">Purgar Logs de Trace ID</button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function NavItem({ icon, id, active, onClick, label }: { icon: any, id: Tab, active: string, onClick: (id: Tab) => void, label: string }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`p-3 rounded-xl transition-all duration-300 relative group flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300 hover:bg-enterprise-800'}`}
    >
      {icon}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-enterprise-800 text-[11px] font-bold text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60] border border-enterprise-700 shadow-xl">
        {label}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-enterprise-800 border-l border-b border-enterprise-700 rotate-45" />
      </div>
    </button>
  );
}

function StatCard({ title, value, unit, trend }: { title: string, value: string, unit: string, trend: string }) {
  const isUp = trend.startsWith('+') || trend === '0.0%';
  return (
    <div className="glass-panel p-6 border-enterprise-700/30">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
      <div className={`mt-3 text-[10px] font-bold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
        <div className={`w-1 h-1 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        {trend} vs semana anterior
      </div>
    </div>
  );
}

function LogEntry({ status, msg, time }: { status: 'success' | 'error', msg: string, time: string }) {
  return (
    <div className="flex items-center gap-3 text-xs group">
      {status === 'success' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
      <span className="text-slate-400 font-mono group-hover:text-slate-200 transition-colors flex-1">{msg}</span>
      <span className="text-slate-600 text-[9px] font-bold uppercase">{time}</span>
    </div>
  );
}

function AgentStatus({ name, status, load }: { name: string, status: string, load: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-bold text-slate-300">{name}</span>
          <span className="text-[9px] uppercase font-bold text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/5">{status}</span>
       </div>
       <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-enterprise-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${load}%` }}
            className={`h-full ${load > 80 ? 'bg-rose-500' : load > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
          />
       </div>
    </div>
  );
}

function TopologyNode({ icon, label, sub, active, highlight }: { icon: any, label: string, sub: string, active?: boolean, highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${highlight ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-110 z-10' : active ? 'bg-enterprise-900 border-enterprise-700 text-slate-300' : 'bg-enterprise-950 border-enterprise-800 text-slate-600'}`}>
          {icon}
       </div>
       <div className="text-center">
          <div className={`text-[11px] font-bold ${highlight ? 'text-white' : 'text-slate-300'}`}>{label}</div>
          <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{sub}</div>
       </div>
    </div>
  );
}

function SettingItem({ title, desc, extra }: { title: string, desc: string, extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-6 glass-panel border-enterprise-800 hover:border-enterprise-700 transition-all cursor-pointer group">
       <div className="space-y-1">
          <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h4>
          <p className="text-sm text-slate-500">{desc}</p>
       </div>
       {extra}
    </div>
  );
}

function Switch({ active }: { active?: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full p-1 transition-all ${active ? 'bg-indigo-600' : 'bg-enterprise-700'}`}>
       <div className={`w-3 h-3 bg-white rounded-full transition-all ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );
}
