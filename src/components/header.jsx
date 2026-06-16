import { RefreshCw, Database, Cloud } from 'lucide-react';
import { useEco } from '../context/EcoContext';

export default function Header({ currentView }) {
  const { apiKey, resetData } = useEco();

  const viewTitles = {
    dashboard: 'Analytics Dashboard',
    calculator: 'Carbon Footprint Calculator',
    coach: 'AI Sustainability Coach',
    predictor: 'Carbon Trend & AI Prediction',
    settings: 'Configuration & Settings',
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all carbon metrics and chat logs to factory defaults?")) {
      resetData();
      window.location.reload();
    }
  };

  return (
    <header className="border-b border-darkBorder bg-darkBg/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">{viewTitles[currentView] || 'EcoSphere AI'}</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time carbon emissions analysis and coaching</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Mode Badge */}
        {apiKey ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Mode (Gemini Active)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Database className="w-3.5 h-3.5" />
            <span>Sandbox Mode (Simulated AI)</span>
          </div>
        )}

        {/* Reset State Button */}
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all duration-300"
          title="Reset application data"
          aria-label="Reset application data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
