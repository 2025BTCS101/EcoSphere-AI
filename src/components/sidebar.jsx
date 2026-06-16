import { 
  LayoutDashboard, 
  Calculator, 
  MessageSquareCode, 
  Settings, 
  Leaf, 
  TrendingUp,
  Award
} from 'lucide-react';
import { useEco } from '../context/EcoContext';
import PropTypes from 'prop-types';

export default function Sidebar({ currentView, setView }) {
  const { ecoScore, getEcoRank } = useEco();
  const rank = getEcoRank(ecoScore);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Carbon Calculator', icon: Calculator },
    { id: 'coach', label: 'AI Coach', icon: MessageSquareCode },
    { id: 'predictor', label: 'Carbon Prediction', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-darkBorder bg-[#090d16]/80 backdrop-blur-lg flex flex-col h-screen fixed md:sticky top-0 left-0 z-40 transition-transform duration-300">
      {/* Brand Logo */}
      <div className="p-6 border-b border-darkBorder flex items-center gap-3">
        <div className="bg-brandGreen-500/10 p-2 rounded-xl border border-brandGreen-500/20 text-brandGreen-500 shadow-glow">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-semibold text-lg tracking-wider text-white">EcoSphere <span className="text-brandGreen-500">AI</span></h1>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">SaaS Intelligence</span>
        </div>
      </div>

      {/* Dynamic Rank Card */}
      <div className="p-4 mx-4 mt-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Award className="w-3.5 h-3.5 text-brandGreen-500" />
            <span>ECO RANK</span>
          </div>
          <span className="text-xs font-bold text-slate-400">{ecoScore}/1000</span>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-center text-xs font-bold tracking-wide ${rank.color}`}>
          {rank.title}
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
          <div 
            className="bg-brandGreen-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(ecoScore / 1000) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1" role="tablist">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-brandGreen-600 text-white shadow-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-darkBorder text-center">
        <p className="text-xs text-slate-500">EcoSphere AI v1.0.0</p>
        <p className="text-[10px] text-brandGreen-500/60 font-semibold mt-1">Hackathon Build</p>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
};
