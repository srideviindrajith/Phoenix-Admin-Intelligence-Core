import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  Settings as SettingsIcon,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Play,
  RotateCcw,
  Sliders,
  Terminal as TerminalIcon,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Shield,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Send,
  Lock,
  Globe
} from 'lucide-react';

// Interfaces
interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYS' | 'CRM' | 'BILL' | 'AUTO' | 'PORT' | 'AI';
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

interface CoreNode {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Maintenance' | 'Offline';
  latency: number;
  requests: number;
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('phx_admin_auth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Router State
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  // Sidebar Collapse state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Operations and Simulation State
  const [cores, setCores] = useState<CoreNode[]>([
    { id: 'crm', name: 'PhoenixCRM Core', category: 'CRM', status: 'Active', latency: 145, requests: 124 },
    { id: 'billing', name: 'PhoenixBilling Core', category: 'Billing', status: 'Active', latency: 210, requests: 88 },
    { id: 'automation', name: 'AI Automation Core', category: 'Automation', status: 'Active', latency: 98, requests: 312 },
    { id: 'portal', name: 'Client Portal Core', category: 'Client Portal', status: 'Active', latency: 175, requests: 45 },
  ]);

  const [aiStats, setAiStats] = useState({
    avgLatency: 124,
    tokenCost: 0.0021,
    confidenceIndex: 98.6,
    totalCalls: 14290,
  });

  const [latencyHistory, setLatencyHistory] = useState<number[]>([120, 125, 118, 130, 122, 115, 128, 124, 132, 120, 110, 118, 126, 122, 124]);
  const [cpuUsage, setCpuUsage] = useState(38);
  const [memoryUsage, setMemoryUsage] = useState(62.4);

  // System Logs Stream
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '21:10:04', source: 'SYS', level: 'info', message: 'Aura Intelligence Core boot sequence complete.' },
    { id: '2', timestamp: '21:10:06', source: 'SYS', level: 'success', message: 'Supabase DB connection pool initialized (14 connections active).' },
    { id: '3', timestamp: '21:10:12', source: 'CRM', level: 'info', message: 'Syncing sales pipelines with CRM database. Status: OK' },
    { id: '4', timestamp: '21:10:20', source: 'AI', level: 'success', message: 'Gemini 1.5 Pro model parameters verified successfully.' },
    { id: '5', timestamp: '21:10:35', source: 'BILL', level: 'info', message: 'Daily automated billing scheduler synced with Stripe gateway.' },
    { id: '6', timestamp: '21:10:55', source: 'AUTO', level: 'warn', message: 'Rate limit for Slack Hook approaching 85%. Throttling enabled.' },
    { id: '7', timestamp: '21:11:15', source: 'PORT', level: 'success', message: 'Active Client secure socket listener established.' },
  ]);

  // Model Selector & Sandbox state
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.9);
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [sandboxTesting, setSandboxTesting] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);

  // Settings state
  const [settings, setSettings] = useState({
    apiKey: 'sk-phx••••••••••••••••••••3a9b',
    webhookUrl: 'https://api.phoenixai.studio/v1/telemetry/webhook',
    alertThreshold: 300,
    retentionDays: 30,
    enableNotifications: true,
  });

  const [alertOpen, setAlertOpen] = useState(true);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Hash-based router listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validRoutes = ['dashboard', 'telemetry', 'core-manager', 'model-hub', 'settings'];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    const currentHash = window.location.hash.replace('#', '');
    if (['dashboard', 'telemetry', 'core-manager', 'model-hub', 'settings'].includes(currentHash)) {
      setCurrentRoute(currentHash);
    } else {
      window.location.hash = 'dashboard';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    if (window.innerWidth < 1024) {
      setSidebarOpen(false); // Auto close sidebar on mobile
    }
  };

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Operational Simulation Engine
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Simulate CPU & Memory ticks
      setCpuUsage(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(15, Math.min(85, prev + change));
      });
      setMemoryUsage(prev => {
        const change = (Math.random() * 3) - 1.5; // -1.5 to +1.5
        return Math.max(50, Math.min(80, prev + change));
      });

      // Update Node requests and latency
      setCores(prevCores => {
        return prevCores.map(core => {
          if (core.status !== 'Active') return core;
          const latencyChange = Math.floor(Math.random() * 21) - 10; // -10 to +10
          const reqsChange = Math.floor(Math.random() * 11) - 5; // -5 to +5
          return {
            ...core,
            latency: Math.max(80, Math.min(350, core.latency + latencyChange)),
            requests: Math.max(10, Math.min(600, core.requests + reqsChange)),
          };
        });
      });

      // Update AI Telemetry Stats
      setAiStats(prev => {
        const latencyChange = Math.floor(Math.random() * 7) - 3;
        const newCalls = prev.totalCalls + Math.floor(Math.random() * 4) + 1;
        const newAvg = Math.max(90, Math.min(200, prev.avgLatency + latencyChange));
        
        // Append to latency plot list
        setLatencyHistory(history => {
          const nextHistory = [...history.slice(1), newAvg];
          return nextHistory;
        });

        return {
          ...prev,
          avgLatency: newAvg,
          totalCalls: newCalls,
        };
      });

      // Random trace logs injection
      const logTemplates: { source: LogEntry['source']; level: LogEntry['level']; message: string }[] = [
        { source: 'SYS', level: 'info', message: 'Background sync cycle triggered.' },
        { source: 'AI', level: 'success', message: 'Inference response processed successfully. Tokens: 384.' },
        { source: 'CRM', level: 'info', message: 'Lead telemetry push verified.' },
        { source: 'BILL', level: 'success', message: 'Invoice ledger update synced successfully.' },
        { source: 'AUTO', level: 'info', message: 'AI Agent queue processing event complete.' },
        { source: 'PORT', level: 'info', message: 'Refreshed access tokens for user session.' },
      ];

      const triggerLog = Math.random() > 0.4;
      if (triggerLog) {
        const randTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        const date = new Date();
        const timestamp = date.toTimeString().split(' ')[0];
        
        setLogs(prevLogs => {
          const nextLogs = [
            ...prevLogs,
            {
              id: Math.random().toString(),
              timestamp,
              ...randTemplate
            }
          ];
          // Limit logs count to 60 items
          return nextLogs.slice(-60);
        });
      }

    }, 3500);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError('');

    setTimeout(() => {
      if (email === 'admin@phoenixai.studio' && password === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('phx_admin_auth', 'true');
        setLoadingLogin(false);
      } else {
        setLoginError('Invalid administrator credentials.');
        setLoadingLogin(false);
      }
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('phx_admin_auth');
  };

  // Simulate Event Trigger
  const triggerManualEvent = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const logSources: LogEntry['source'][] = ['SYS', 'CRM', 'BILL', 'AUTO', 'PORT', 'AI'];
    const chosenSource = logSources[Math.floor(Math.random() * logSources.length)];
    
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp,
        source: chosenSource,
        level: 'success',
        message: `Manual diagnostics override dispatched. Telemetry node verified.`
      }
    ]);
  };

  // Simulate sandbox inference testing
  const runSandboxInference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxPrompt.trim()) return;

    setSandboxTesting(true);
    setSandboxLogs([]);
    setSandboxOutput('');

    const stepLogs = [
      '⚡ [SYS] Constructing context prompt vectors...',
      `🧠 [AI] Selecting model parameters: ${selectedModel} (Temp: ${temperature})`,
      '📡 [NET] Dispatching secure payload to inference engine API...',
      '🛠️ [SYS] Received stream chunk tokens...',
      '✅ [SYS] Processed final response block.'
    ];

    let delay = 0;
    stepLogs.forEach((logText, idx) => {
      setTimeout(() => {
        setSandboxLogs(prev => [...prev, logText]);
        if (idx === stepLogs.length - 1) {
          // Final output response
          setSandboxTesting(false);
          const promptsMap: Record<string, string> = {
            'gemini-1.5-pro': `[GEMINI_PRO // OUTPUT_NODE]\n\nBased on your prompt, I have computed the optimal execution strategy for PhoenixAI Studio operations. By configuring the automation hooks to pass through unified JSON formats, you will reduce memory overhead by 32%.\n\nTarget latency: 120ms\nSuggested pipeline: node_db_sync -> crm_lead_push`,
            'claude-3.5-sonnet': `[CLAUDE_SONNET // TELEMETRY_REPLY]\n\nProcessing intelligence prompt. Analysis of the Phoenix systems indicates high data integrity but minor queue lock contention in the AI Automation Core during peak periods. Setting the concurrency backoff threshold to 0.7s will solve it.`,
            'gpt-4o': `[GPT_4O // COMPILATION_SUCCESS]\n\nInference complete. Recommending core orchestration updates. We detected that PhoenixBilling Core is executing transactions with an average latency of 210ms. Initiating cached token verification reduces this latency to 95ms.`,
            'llama-3.1': `[LLAMA_3.1 // SYNAPSE_VEC]\n\nPrompt received. Generating intelligence telemetry vectors. Analyzing logs... All peripheral cores (CRM, Billing, Automation, Portal) are running online. System checks OK. No anomalous activity detected.`
          };
          setSandboxOutput(promptsMap[selectedModel] || promptsMap['gemini-1.5-pro']);
        }
      }, delay);
      delay += 800;
    });
  };

  // Node controls
  const toggleNodeStatus = (id: string) => {
    setCores(prev => prev.map(core => {
      if (core.id !== id) return core;
      const nextStatusMap: Record<CoreNode['status'], CoreNode['status']> = {
        'Active': 'Maintenance',
        'Maintenance': 'Offline',
        'Offline': 'Active'
      };
      return {
        ...core,
        status: nextStatusMap[core.status]
      };
    }));
  };

  const reSyncNode = (name: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp,
        source: 'SYS',
        level: 'warn',
        message: `Force sync dispatched for core: ${name}. Rebuilding local indexing tables.`
      }
    ]);
  };

  // Main UI render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070A0F] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        {/* Neon decorative background rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 glass-panel-glow p-8 rounded-2xl border border-white/5 shadow-2xl">
          {/* Scanline element */}
          <div className="absolute inset-0 scanline rounded-2xl pointer-events-none opacity-30 overflow-hidden">
            <div className="w-full h-1/2 bg-gradient-to-b from-[#FF6A00]/10 to-transparent animate-scan" />
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#CC4F00] flex items-center justify-center shadow-lg shadow-[#FF6A00]/25 mb-4">
              <Zap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold font-space text-white tracking-wide">PHOENIX // CORE</h1>
            <p className="text-gray-400 text-sm mt-1 text-center">Admin Intelligence Console & Command Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Administrator Identity</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@phoenixai.studio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Security Access Token</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#CC4F00] text-white text-sm font-semibold uppercase tracking-wider hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-[#FF6A00]/20 disabled:opacity-50"
            >
              {loadingLogin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating System...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Grant Decryption Access
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-gray-500 font-mono">
            SECURE CHANNEL // SYSTEM CREDENTIALS REQUIRED // IP LOGGED
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-gray-200 flex relative overflow-hidden font-sans">
      
      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0A0E17]/90 lg:bg-[#0A0E17]/60 border-r border-white/5 z-40 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0'} shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A00] to-[#CC4F00] flex items-center justify-center shadow-md shadow-[#FF6A00]/25">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm text-white font-space tracking-wide">PHOENIX // CORE</span>
                <div className="text-[9px] text-[#FF6A00] font-mono font-semibold uppercase tracking-wider">Admin Console</div>
              </div>
            </div>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentRoute === 'dashboard'
                  ? 'bg-gradient-to-r from-[#FF6A00]/15 to-transparent border-l-2 border-[#FF6A00] text-white'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              Overview
            </button>

            <button
              onClick={() => navigateTo('telemetry')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentRoute === 'telemetry'
                  ? 'bg-gradient-to-r from-[#FF6A00]/15 to-transparent border-l-2 border-[#FF6A00] text-white'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <Activity className="w-4.5 h-4.5" />
              Telemetry Logs
            </button>

            <button
              onClick={() => navigateTo('core-manager')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentRoute === 'core-manager'
                  ? 'bg-gradient-to-r from-[#FF6A00]/15 to-transparent border-l-2 border-[#FF6A00] text-white'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <Layers className="w-4.5 h-4.5" />
              Core Systems
            </button>

            <button
              onClick={() => navigateTo('model-hub')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentRoute === 'model-hub'
                  ? 'bg-gradient-to-r from-[#FF6A00]/15 to-transparent border-l-2 border-[#FF6A00] text-white'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <Cpu className="w-4.5 h-4.5" />
              AI Model Hub
            </button>

            <button
              onClick={() => navigateTo('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentRoute === 'settings'
                  ? 'bg-gradient-to-r from-[#FF6A00]/15 to-transparent border-l-2 border-[#FF6A00] text-white'
                  : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4.5 h-4.5" />
              System Config
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="p-3 bg-[#0B0F17]/80 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-gray-500 font-mono">NODE HEALTH</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">100% SECURE</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Exit Workspace
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* Scanline overlay for aesthetic */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-10 pointer-events-none" />

        {/* Global Toolbar Header */}
        <header className="h-16 border-b border-white/5 bg-[#070A0F]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-white text-md font-bold font-space capitalize">{currentRoute.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-white/5 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-400">TELEMETRY LINK // ACTIVE</span>
            </div>

            {/* Quick alert notifications indicator */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6A00]" />
              </button>
            </div>
          </div>
        </header>

        {/* Active Content panel */}
        <main className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Active alerts banner if dashboard */}
          {alertOpen && currentRoute === 'dashboard' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF6A00]/10 to-transparent border border-[#FF6A00]/20 flex items-start gap-4 shadow-lg shadow-[#FF6A00]/5 relative">
              <div className="p-2 rounded-lg bg-[#FF6A00]/10">
                <Shield className="w-5 h-5 text-[#FF6A00]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-semibold tracking-wide">Orchestration Nodes Synced Successfully</h4>
                <p className="text-xs text-gray-400 mt-0.5">Admin Intelligence is active. Core nodes telemetry (CRM, Billing, Automations, Portal) is currently mapping. No security discrepancies found.</p>
              </div>
              <button className="text-gray-500 hover:text-white" onClick={() => setAlertOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ROUTE 1: DASHBOARD VIEW */}
          {currentRoute === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Stat grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Latency card */}
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold text-gray-500 font-mono tracking-wider">AVG MODEL LATENCY</span>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>-12.4%</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-space tracking-tight">{aiStats.avgLatency}</span>
                    <span className="text-xs text-gray-500 font-mono">ms</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>Aura Engine Telemetry</span>
                    <span className="font-mono text-cyan-400">OPTIMAL</span>
                  </div>
                </div>

                {/* Costs card */}
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6A00]/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold text-gray-500 font-mono tracking-wider">UNIT INFERENCE COST</span>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      <span>STABLE</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-space tracking-tight">${aiStats.tokenCost.toFixed(4)}</span>
                    <span className="text-[10px] text-gray-500 font-mono">/ 1k tokens</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>Gemini API Node</span>
                    <span className="font-mono text-emerald-500">98% COMPACT</span>
                  </div>
                </div>

                {/* Confidence Card */}
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold text-gray-500 font-mono tracking-wider">AGENT ACCURACY RATE</span>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+0.2%</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-space tracking-tight">{aiStats.confidenceIndex}%</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>Active Test Evaluator</span>
                    <span className="font-mono text-violet-400">EXCELLENT</span>
                  </div>
                </div>

                {/* Total calls card */}
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold text-gray-500 font-mono tracking-wider">TOTAL COMPILING EVENTS</span>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                      <span>LIVE</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-space tracking-tight">{aiStats.totalCalls.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>Ingest Event Counters</span>
                    <span className="font-mono text-amber-400">SECURED</span>
                  </div>
                </div>

              </div>

              {/* Main telemetry visualizer row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Operational Node map visualizer */}
                <div className="glass-panel lg:col-span-2 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-base font-bold font-space mb-1">Node Integration Telemetry</h3>
                    <p className="text-xs text-gray-400">Interactive telemetry topology of connected core micro-systems.</p>
                  </div>

                  <div className="h-64 my-6 flex items-center justify-center bg-[#070A10]/70 rounded-xl relative border border-white/5">
                    {/* Grid background inside SVG wrapper */}
                    <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />

                    <svg className="w-full h-full max-w-lg relative z-10" viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid connections with animated dashes */}
                      <path d="M250 120 L80 50" stroke="rgba(255, 106, 0, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />
                      <path d="M250 120 L80 190" stroke="rgba(255, 106, 0, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />
                      <path d="M250 120 L420 50" stroke="rgba(255, 106, 0, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />
                      <path d="M250 120 L420 190" stroke="rgba(255, 106, 0, 0.4)" strokeWidth="1.5" strokeDasharray="5,5" />

                      {/* Central Node (Admin Intelligence Core) */}
                      <circle cx="250" cy="120" r="28" fill="url(#adminGrad)" stroke="#FF6A00" strokeWidth="2" className="animate-pulse" />
                      <text x="250" y="124" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AI CORE</text>

                      {/* CRM Node */}
                      <circle cx="80" cy="50" r="22" fill="#111722" stroke="rgba(255, 106, 0, 0.3)" strokeWidth="1.5" />
                      <text x="80" y="53" fill="#FF8A33" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">CRM</text>

                      {/* Billing Node */}
                      <circle cx="80" cy="190" r="22" fill="#111722" stroke="rgba(255, 106, 0, 0.3)" strokeWidth="1.5" />
                      <text x="80" y="193" fill="#FF8A33" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">BILL</text>

                      {/* Automation Node */}
                      <circle cx="420" cy="50" r="22" fill="#111722" stroke="rgba(255, 106, 0, 0.3)" strokeWidth="1.5" />
                      <text x="420" y="53" fill="#FF8A33" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AUTO</text>

                      {/* Client Portal Node */}
                      <circle cx="420" cy="190" r="22" fill="#111722" stroke="rgba(255, 106, 0, 0.3)" strokeWidth="1.5" />
                      <text x="420" y="193" fill="#FF8A33" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">PORTAL</text>

                      <defs>
                        <linearGradient id="adminGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop stopColor="#FF6A00" />
                          <stop offset="1" stopColor="#B34A00" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Nodes Status Tooltip overlays */}
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-500 bg-[#070A0F]/60 px-2 py-1 rounded">
                      CRM LATENCY // <span className="text-[#FF8A33]">{cores[0].latency}ms</span>
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-gray-500 bg-[#070A0F]/60 px-2 py-1 rounded">
                      BILL LATENCY // <span className="text-[#FF8A33]">{cores[1].latency}ms</span>
                    </div>
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-gray-500 bg-[#070A0F]/60 px-2 py-1 rounded">
                      AUTO LATENCY // <span className="text-[#FF8A33]">{cores[2].latency}ms</span>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-gray-500 bg-[#070A0F]/60 px-2 py-1 rounded">
                      PORTAL LATENCY // <span className="text-[#FF8A33]">{cores[3].latency}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                    <span>Secure encryption layer: AES-256</span>
                    <button onClick={() => navigateTo('core-manager')} className="flex items-center gap-1 text-[#FF6A00] font-semibold hover:text-white transition-colors">
                      Configure Nodes
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Telemetry stats summary card panel */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-base font-bold font-space mb-1">Orchestration Load</h3>
                    <p className="text-xs text-gray-400">Current compute utilization of the server node pools.</p>
                  </div>

                  <div className="space-y-6 my-6">
                    {/* CPU Progress */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        <span className="text-gray-400 uppercase">Aura Processor CPU Load</span>
                        <span className="text-white font-bold">{cpuUsage}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#FF6A00] to-[#CC4F00] h-full rounded-full transition-all duration-500"
                          style={{ width: `${cpuUsage}%` }}
                        />
                      </div>
                    </div>

                    {/* Memory Progress */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        <span className="text-gray-400 uppercase">HEAP RAM Allocation</span>
                        <span className="text-white font-bold">{memoryUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${memoryUsage}%` }}
                        />
                      </div>
                    </div>

                    {/* Database pool status */}
                    <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-gray-400">Supabase Connection Pool</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">14 ACTIVE</span>
                    </div>

                    {/* Network state */}
                    <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-violet-400" />
                        <span className="text-xs text-gray-400">Secure WebSockets Host</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">STABLE</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={triggerManualEvent}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-xs font-semibold text-white uppercase tracking-wider transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Verify Health Signals
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ROUTE 2: TELEMETRY VIEW */}
          {currentRoute === 'telemetry' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Telemetry charts and active log screen (Takes 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Latency line plot */}
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white text-base font-bold font-space">Real-time Latency Telemetry</h3>
                      <p className="text-xs text-gray-400">Latency telemetry tracked in milliseconds over current operational cycles.</p>
                    </div>
                    <div className="px-3 py-1 bg-[#FF6A00]/15 rounded-lg border border-[#FF6A00]/20 text-xs font-mono text-[#FF6A00]">
                      {aiStats.avgLatency}ms (Average)
                    </div>
                  </div>

                  <div className="h-44 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                      {/* Latency trend line */}
                      <polyline
                        fill="none"
                        stroke="#FF6A00"
                        strokeWidth="2.5"
                        points={latencyHistory.map((val, index) => {
                          const x = (index / (latencyHistory.length - 1)) * 400;
                          const y = 120 - ((val - 80) / 150) * 120; // Normalizing between 80ms and 230ms
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      
                      {/* Area under curve gradient */}
                      <polygon
                        fill="url(#latencyAreaGrad)"
                        points={`0,120 ${latencyHistory.map((val, index) => {
                          const x = (index / (latencyHistory.length - 1)) * 400;
                          const y = 120 - ((val - 80) / 150) * 120;
                          return `${x},${y}`;
                        }).join(' ')} 400,120`}
                      />

                      {/* SVG Grid horizontal lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                      <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                      <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />

                      <defs>
                        <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-4 pt-3 border-t border-white/5">
                    <span>15 CYCLES AGO</span>
                    <span>10 CYCLES AGO</span>
                    <span>ACTIVE CYCLE</span>
                  </div>
                </div>

                {/* Log streaming terminal component */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-base font-bold font-space">Trace Log Terminal</h3>
                      <p className="text-xs text-gray-400">Dynamic operations logs streamed across core systems and databases.</p>
                    </div>
                    <button
                      onClick={triggerManualEvent}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs text-white hover:bg-white/[0.08] flex items-center gap-1.5 transition-all font-mono"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#FF6A00]" />
                      SIMULATE EVENT
                    </button>
                  </div>

                  <div className="bg-[#05070B] border border-white/5 rounded-xl p-4 font-mono text-xs h-72 overflow-y-auto space-y-2.5 relative">
                    {/* Scanline grid inside terminal */}
                    <div className="absolute inset-0 scanline rounded-xl pointer-events-none opacity-10" />

                    {logs.map((log) => {
                      const levelColors: Record<LogEntry['level'], string> = {
                        info: 'text-blue-400',
                        warn: 'text-amber-400',
                        error: 'text-red-400',
                        success: 'text-emerald-400',
                      };
                      return (
                        <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-gray-600 font-bold shrink-0">{log.timestamp}</span>
                          <span className="text-cyan-500 font-bold shrink-0">[{log.source}]</span>
                          <span className={`${levelColors[log.level]} shrink-0 uppercase font-bold`}>{log.level}:</span>
                          <span className="text-gray-300">{log.message}</span>
                        </div>
                      );
                    })}
                    <div ref={logsEndRef} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-4 pt-3 border-t border-white/5">
                    <span>SYS TRACE MODULE: ACTIVE</span>
                    <span>STREAM BUFFER: {logs.length}/60 ENTRIES</span>
                  </div>
                </div>

              </div>

              {/* Telemetry settings metrics sidebar */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-base font-bold font-space mb-1">Ingestion Target Node</h3>
                  <p className="text-xs text-gray-400">Settings and active variables for telemetry push triggers.</p>
                </div>

                <div className="my-6 space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">Webhook Ingest Endpoint</label>
                    <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 text-xs text-gray-300 font-mono select-all overflow-hidden text-ellipsis whitespace-nowrap">
                      {settings.webhookUrl}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">Ingest Authentication Key</label>
                    <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 text-xs text-gray-300 font-mono select-all overflow-hidden text-ellipsis">
                      {settings.apiKey}
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#FF6A00]" />
                      <span className="text-xs text-gray-400">Secure SHA-256 Tokens</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">ENABLED</span>
                  </div>

                  <div className="p-3 bg-[#0B0F17] rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">Local Debug Logging</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF6A00]">VERIFIED</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={() => navigateTo('settings')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border border-[#FF6A00]/10 text-xs font-semibold text-[#FF6A00] uppercase tracking-wider transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Modify telemetry Config
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ROUTE 3: CORE MANAGER VIEW */}
          {currentRoute === 'core-manager' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cores.map((core) => {
                  const statusColors: Record<CoreNode['status'], string> = {
                    Active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    Maintenance: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    Offline: 'text-red-400 bg-red-500/10 border-red-500/20',
                  };

                  return (
                    <div key={core.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wide">{core.category} MODULE</div>
                          <h4 className="text-white text-base font-bold font-space mt-0.5">{core.name}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold font-mono border ${statusColors[core.status]}`}>
                          {core.status}
                        </span>
                      </div>

                      {/* Telemetry info row */}
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="p-3 bg-[#0D121F] rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-500 font-mono">LATENCY (NODE)</span>
                          <p className="text-white text-lg font-bold font-space mt-1">
                            {core.status === 'Active' ? `${core.latency} ms` : 'N/A'}
                          </p>
                        </div>
                        <div className="p-3 bg-[#0D121F] rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-500 font-mono">ACTIVE REQS / SEC</span>
                          <p className="text-white text-lg font-bold font-space mt-1">
                            {core.status === 'Active' ? core.requests : 0}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => toggleNodeStatus(core.id)}
                          className="flex-1 py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-xs font-semibold text-white uppercase tracking-wider transition-all text-center"
                        >
                          TOGGLE STATE
                        </button>
                        <button
                          onClick={() => reSyncNode(core.name)}
                          className="py-2 px-3 rounded-lg bg-[#FF6A00]/10 hover:bg-[#FF6A00]/25 border border-[#FF6A00]/10 text-xs font-bold text-[#FF6A00] uppercase tracking-wider transition-all"
                        >
                          FORCE SYNC
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Core orchestration settings summary */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Database className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold font-space">Supabase Storage Sync</h3>
                    <p className="text-xs text-gray-400">Ensure the peripheral nodes can query client schema data.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#0B0F17] rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-xs text-gray-300 leading-relaxed font-mono">
                    Node Pool Ingestion Key: <span className="text-[#FF6A00]">phx_prod_key_7701</span> // Encryption: SHA-256
                  </div>
                  <button className="py-2 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold hover:bg-white/[0.08] transition-colors self-start md:self-auto uppercase font-mono text-[#FF6A00]">
                    Clear Redis Cache
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ROUTE 4: AI MODEL HUB VIEW */}
          {currentRoute === 'model-hub' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Parameter controls */}
              <div className="space-y-6 lg:col-span-1">
                
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-white text-base font-bold font-space mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#FF6A00]" />
                    Model Hyperparameters
                  </h3>

                  <div className="space-y-6">
                    {/* Target Model select */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Target AI Engine</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
                      >
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                        <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="gpt-4o">GPT-4o Console</option>
                        <option value="llama-3.1">Llama 3.1 Instruct (Local)</option>
                      </select>
                    </div>

                    {/* Temperature Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-semibold text-gray-400 uppercase tracking-wide">Temperature</span>
                        <span className="font-mono text-white font-bold">{temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-[#FF6A00] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Max Tokens Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-semibold text-gray-400 uppercase tracking-wide">Max Response length</span>
                        <span className="font-mono text-white font-bold">{maxTokens}</span>
                      </div>
                      <input
                        type="range"
                        min="256"
                        max="8192"
                        step="256"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full accent-[#FF6A00] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Top P Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-semibold text-gray-400 uppercase tracking-wide">Nucleus Sampling (Top-P)</span>
                        <span className="font-mono text-white font-bold">{topP}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={topP}
                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full accent-[#FF6A00] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column: Sandbox Tester (Takes 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-white text-base font-bold font-space mb-1">Inference Testing Console</h3>
                  <p className="text-xs text-gray-400 mb-6">Test instructions directly against the selected AI Model pool using active parameters.</p>

                  <form onSubmit={runSandboxInference} className="space-y-4">
                    <div>
                      <textarea
                        rows={4}
                        placeholder="Type instruction vectors to test (e.g. 'Draft object mapping settings config...')"
                        value={sandboxPrompt}
                        onChange={(e) => setSandboxPrompt(e.target.value)}
                        className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF6A00] transition-colors font-mono resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sandboxTesting || !sandboxPrompt.trim()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#CC4F00] text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-[#FF6A00]/25 flex items-center gap-2 disabled:opacity-50"
                      >
                        {sandboxTesting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            COMPILING INFERENCE...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            TEST INFERENCE
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Testing Trace Logs stream */}
                  {sandboxLogs.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Compilation Trace Logs</h4>
                      <div className="p-4 bg-[#05070B] border border-white/5 rounded-xl font-mono text-[11px] text-gray-400 space-y-2">
                        {sandboxLogs.map((logLine, idx) => (
                          <div key={idx} className="leading-relaxed">
                            {logLine}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sandbox API outputs */}
                  {sandboxOutput && (
                    <div className="mt-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Response Object</h4>
                      <div className="p-5 bg-[#05070B] border border-white/5 rounded-xl font-mono text-xs text-[#00E5FF] leading-relaxed whitespace-pre-wrap select-all relative overflow-hidden">
                        {/* Scanline design inside box */}
                        <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                        {sandboxOutput}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ROUTE 5: SETTINGS VIEW */}
          {currentRoute === 'settings' && (
            <div className="glass-panel p-8 rounded-2xl max-w-2xl">
              <h3 className="text-white text-base font-bold font-space mb-2">Central Node Settings</h3>
              <p className="text-xs text-gray-400 mb-6">Modify system environmental variables and notification hooks.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Ingest Telemetry Endpoint</label>
                  <input
                    type="text"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6A00] transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Aura Sync Authorization Key</label>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6A00] transition-colors font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Latency Alarm limit (ms)</label>
                    <input
                      type="number"
                      value={settings.alertThreshold}
                      onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                      className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6A00] transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Data Retention Buffer (Days)</label>
                    <input
                      type="number"
                      value={settings.retentionDays}
                      onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                      className="w-full bg-[#0D121F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6A00] transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0B0F17] rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-semibold">Enable Slack Alarm Hooks</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Send alerts automatically when latency exceeds thresholds.</span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                    className={`px-4 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${
                      settings.enableNotifications
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-white/[0.02] text-gray-500 border-white/5'
                    }`}
                  >
                    {settings.enableNotifications ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      const timestamp = new Date().toTimeString().split(' ')[0];
                      setLogs(prev => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          timestamp,
                          source: 'SYS',
                          level: 'success',
                          message: 'Environment configuration parameters saved successfully.'
                        }
                      ]);
                      navigateTo('dashboard');
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#CC4F00] text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-[#FF6A00]/25"
                  >
                    Commit Parameters
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
