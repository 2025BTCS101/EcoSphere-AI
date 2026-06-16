import { useState, useEffect } from 'react';
import { useEco } from '../context/EcoContext';
import { getCarbonPredictionInsights } from '../services/gemini';
import GlassCard from '../components/glass-card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingDown, 
  Sparkles, 
  Sliders, 
  Zap,
  RefreshCw
} from 'lucide-react';

// Custom tooltips to match SaaS aesthetic
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const type = entry.payload.type;
    return (
      <div className="bg-[#111827]/90 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-glass">
        <p className="text-xs font-bold text-slate-300 mb-1">{label}</p>
        <p className={`text-xs font-semibold ${type === 'Predicted' ? 'text-brandGreen-400' : 'text-blue-400'}`}>
          Emissions: {entry.value} kg CO2e
        </p>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{type} month</span>
      </div>
    );
  }
  return null;
};

export default function Predictor() {
  const { 
    apiKey, 
    historicalData, 
    currentEmissions 
  } = useEco();

  // Simulating custom offsets next month
  const [transitReductionPercent, setTransitReductionPercent] = useState(10); // 0 to 50
  const [energyReductionPercent, setEnergyReductionPercent] = useState(10); // 0 to 50
  const [isDietGreen, setIsDietGreen] = useState(false);

  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Derived state calculations to avoid state synchronizations in useEffect
  const { transport, electricity, food, shopping } = currentEmissions;
  const simulatedTransport = Math.round(transport * (1 - transitReductionPercent / 100));
  const simulatedEnergy = Math.round(electricity * (1 - energyReductionPercent / 100));
  const simulatedFood = isDietGreen ? Math.round(food * 0.6) : food;
  const simulatedShopping = shopping;

  const predictedEmissions = simulatedTransport + simulatedEnergy + simulatedFood + simulatedShopping;

  const projectionChartData = historicalData.map(d => ({
    month: d.month,
    Emissions: d.total,
    type: 'Actual'
  }));
  projectionChartData.push({
    month: 'Jul (Proj)',
    Emissions: predictedEmissions,
    type: 'Predicted'
  });

  // Load AI Insights dynamically on key events
  const loadInsights = async () => {
    Promise.resolve().then(() => setLoadingInsight(true));
    try {
      const insight = await getCarbonPredictionInsights(apiKey, historicalData, currentEmissions);
      setAiInsight(insight);
    } catch (error) {
      console.error(error);
      setAiInsight("Unable to fetch AI prediction insight at this moment. Focus on transit reduction!");
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchInsights = async () => {
      Promise.resolve().then(() => {
        if (active) setLoadingInsight(true);
      });
      try {
        const insight = await getCarbonPredictionInsights(apiKey, historicalData, currentEmissions);
        if (active) setAiInsight(insight);
      } catch (error) {
        console.error(error);
        if (active) setAiInsight("Unable to fetch AI prediction insight at this moment. Focus on transit reduction!");
      } finally {
        if (active) setLoadingInsight(false);
      }
    };
    fetchInsights();
    return () => {
      active = false;
    };
  }, [apiKey, historicalData, currentEmissions]);

  return (
    <div className="p-6 space-y-6">
      
      {/* Top prediction dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Simulation Controls (1/3) */}
        <div className="space-y-6">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-5 h-5 text-brandGreen-500" />
                <div>
                  <h3 className="font-bold text-lg text-white">Pathway Simulation</h3>
                  <p className="text-xs text-slate-400">Simulate habits for next month</p>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {/* Transport reduction slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sim-commute" className="text-slate-300 font-medium">Reduce Commuting</label>
                    <span className="text-brandGreen-400 font-bold">-{transitReductionPercent}%</span>
                  </div>
                  <input 
                    id="sim-commute"
                    type="range" 
                    min="0" 
                    max="50" 
                    step="5"
                    value={transitReductionPercent}
                    onChange={(e) => setTransitReductionPercent(Number(e.target.value))}
                    className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[9px] text-slate-500 block">Switch driving trips to biking, walking, or public transit.</span>
                </div>

                {/* Energy reduction slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sim-energy" className="text-slate-300 font-medium">Reduce Home Energy</label>
                    <span className="text-brandGreen-400 font-bold">-{energyReductionPercent}%</span>
                  </div>
                  <input 
                    id="sim-energy"
                    type="range" 
                    min="0" 
                    max="50" 
                    step="5"
                    value={energyReductionPercent}
                    onChange={(e) => setEnergyReductionPercent(Number(e.target.value))}
                    className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[9px] text-slate-500 block">Optimize AC/heating temp settings, shift to smart power strips.</span>
                </div>

                {/* Diet toggler */}
                <div className="space-y-3 pt-2">
                  <span className="text-sm font-medium text-slate-300 block">Shift to Low-Carbon Diet</span>
                  <button
                    type="button"
                    onClick={() => setIsDietGreen(prev => !prev)}
                    aria-pressed={isDietGreen}
                    aria-label="Toggle plant-based diet simulation"
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      isDietGreen 
                        ? 'border-brandGreen-500/40 bg-brandGreen-500/10 text-white' 
                        : 'border-white/5 bg-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-xl">🥗</span>
                      <div>
                        <p className="text-xs font-semibold text-white">Plant-Based Transition</p>
                        <p className="text-[9px] text-slate-400">Lowers food emission factor by 40%</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 ${isDietGreen ? 'bg-brandGreen-500' : 'bg-white/15'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transition-all duration-300 ${isDietGreen ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Future forecasting models use regression curves and diet/energy lifecycle coefficients.
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Forecasting Chart & Stats (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Carbon Prediction & Forecast</h3>
                <p className="text-xs text-slate-400">Projection curve including next month's simulated impact</p>
              </div>

              {/* Total simulated result */}
              <div className="text-right">
                <span className="text-xs text-slate-400">Projected July Emissions</span>
                <p className="text-2xl font-black text-brandGreen-400 glow-text-green">{predictedEmissions} kg</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projectionChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Visualizing line showing actual vs prediction */}
                  <Area 
                    type="monotone" 
                    dataKey="Emissions" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProjection)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* AI Carbon Insights card */}
          <GlassCard className="p-6 border-brandGreen-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brandGreen-400 animate-pulse" />
                <h4 className="font-bold text-sm text-white">AI Sustainability Pathway Insights</h4>
              </div>
              <button
                type="button"
                onClick={loadInsights}
                disabled={loadingInsight}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-50 disabled:animate-spin"
                title="Regenerate Insights"
                aria-label="Regenerate Insights"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingInsight ? (
              <div className="space-y-2 py-4">
                <div className="h-3.5 bg-white/5 rounded w-3/4 animate-pulse"></div>
                <div className="h-3.5 bg-white/5 rounded w-5/6 animate-pulse"></div>
                <div className="h-3.5 bg-white/5 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-4 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                {aiInsight}
              </div>
            )}
            
            <div className="flex gap-4 mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brandGreen-500" />
                <span className="text-[10px] text-slate-400">Target reduction: <span className="font-semibold text-white">-{transitReductionPercent + energyReductionPercent}%</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] text-slate-400">Primary driver: <span className="font-semibold text-white">Transport Commute</span></span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
