import { useEco } from '../context/EcoContext';
import GlassCard from '../components/glass-card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Award, 
  Leaf, 
  TrendingDown,
  Zap, 
  Check, 
  Plus, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

// Custom tooltips to match SaaS aesthetic
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827]/90 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-glass">
        <p className="text-xs font-bold text-slate-300 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value} kg CO2e
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { 
    currentEmissions, 
    ecoScore, 
    getEcoRank, 
    historicalData, 
    habits, 
    toggleHabit, 
    treesEquivalent 
  } = useEco();

  const rank = getEcoRank(ecoScore);

  // Pie chart data formatting
  const pieData = [
    { name: 'Transport', value: currentEmissions.transport, color: '#3b82f6' },
    { name: 'Energy', value: currentEmissions.electricity, color: '#fbbf24' },
    { name: 'Food / Diet', value: currentEmissions.food, color: '#10b981' },
    { name: 'Shopping', value: currentEmissions.shopping, color: '#a78bfa' },
  ].filter(item => item.value > 0);

  // Get highest emissions category for personalized insights
  const getPersonalizedInsights = () => {
    const categories = [
      { name: 'Transport', value: currentEmissions.transport, tips: [
        '🚗 Ground commute is your largest emission sector. Try public transit or carpooling twice a week to save up to 120kg CO2e/month.',
        '✈️ Limit non-essential flights or buy verified gold-standard offsets when traveling by air.',
        '🚲 Consider switching short trips (<5km) to walking or electric biking to eliminate tailpipe emissions.'
      ]},
      { name: 'Energy', value: currentEmissions.electricity, tips: [
        '💡 Residential energy usage is a significant carbon contributor. Switch your light bulbs to LEDs (uses 75% less power).',
        '🌡️ Adjust your smart thermostat by just 1-2 degrees. This can trim up to 10% off your monthly utility bill.',
        '🔌 Connect home entertainment and computing hubs to smart power strips to prevent phantom load draw.'
      ]},
      { name: 'Food / Diet', value: currentEmissions.food, tips: [
        '🥗 Transitioning to vegetarian or fully plant-based meal days twice a week will reduce dietary emissions by up to 35%.',
        '🧊 Prevent food waste by planning weekly meals. Landfilled food waste produces high levels of heat-trapping methane.',
        '🍏 Shop for local, seasonal produce to minimize the long-distance air-freight impact of out-of-season items.'
      ]},
      { name: 'Shopping', value: currentEmissions.shopping, tips: [
        '🛍️ Lifecycle manufacturing footprints represent significant indirect impact. Practice the 48-hour rule before buying discretionary items.',
        '💻 Prioritize purchasing refurbished electronics or durable goods that are built to be repaired rather than replaced.',
        '👕 Explore thrift options or second-hand clothing marketplaces to double a garment\'s lifecycle and reduce impact by 44%.'
      ]}
    ];

    // Find the category with maximum emissions
    const maxCategory = categories.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    return maxCategory;
  };

  const insightData = getPersonalizedInsights();

  return (
    <div className="p-6 space-y-6">
      
      {/* 3-Card Header Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Eco Score Card */}
        <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brandGreen-500/5 rounded-full filter blur-2xl group-hover:bg-brandGreen-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eco Score</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">{ecoScore}</h3>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${rank.color}`}>
              {rank.title}
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brandGreen-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${(ecoScore / 1000) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Rank shifts: <span className="font-semibold text-slate-300">Climate Guardian</span> at 500, <span className="font-semibold text-slate-300">Eco Hero</span> at 800.
            </p>
          </div>
        </GlassCard>

        {/* Carbon Footprint Card */}
        <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Footprint</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {currentEmissions.total} <span className="text-sm font-semibold text-slate-400">kg CO2e</span>
              </h3>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-2 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-[10px] text-slate-400">
              National avg user footprint is ~800 kg.
            </div>
            <div className="text-xs font-bold text-brandGreen-400 flex items-center gap-1">
              <span>{Math.round(((800 - currentEmissions.total) / 800) * 100)}% better than average</span>
            </div>
          </div>
        </GlassCard>

        {/* Trees Equivalent Card */}
        <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trees Equivalent</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {treesEquivalent} <span className="text-sm font-semibold text-slate-400">trees</span>
              </h3>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2 rounded-xl">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 text-[10px] text-slate-400">
            Number of mature forest trees needed to offset your monthly carbon output.
          </div>
        </GlassCard>

      </div>

      {/* Main Charts & Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Carbon Footprint Trend</h3>
                <p className="text-xs text-slate-400">Monthly breakdown of historical logs (kg CO2e)</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-brandGreen-400 font-semibold bg-brandGreen-500/10 px-2 py-1 rounded-lg">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Improving Trend</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShopping" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="transport" name="Transport" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTransport)" />
                  <Area type="monotone" dataKey="electricity" name="Energy" stackId="1" stroke="#fbbf24" fillOpacity={1} fill="url(#colorElectricity)" />
                  <Area type="monotone" dataKey="food" name="Diet" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorFood)" />
                  <Area type="monotone" dataKey="shopping" name="Shopping" stackId="1" stroke="#a78bfa" fillOpacity={1} fill="url(#colorShopping)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Breakdown Pie Chart (1/3 column) */}
        <div>
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-white mb-1">Carbon Breakdown</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Allocation of your current month's emissions</p>
            </div>

            {pieData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-500" />
                <p className="text-xs text-slate-400">No calculation data registered yet. Go to Calculator to start modeling!</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Labels legend */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4 border-t border-white/5 pt-4">
                  {pieData.map((item, idx) => {
                    const percentage = Math.round((item.value / Math.max(1, currentEmissions.total)) * 100);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                        <div className="text-left">
                          <p className="text-[10px] text-slate-400 leading-none">{item.name}</p>
                          <p className="text-xs font-bold text-white mt-1 leading-none">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

      </div>

      {/* Personalized Reduction Pathway Recommendations */}
      <GlassCard className="p-6 border-brandGreen-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brandGreen-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg text-white">Personalized Reduction Priority</h3>
            <p className="text-xs text-slate-400">Custom lifestyle improvements based on your highest emission sector</p>
          </div>
        </div>

        <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-300 font-semibold mb-3">
            Your primary emission driver is <span className="text-brandGreen-400 font-bold">{insightData.name}</span>. Here is your targeted action roadmap:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-400">
            {insightData.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-brandGreen-500/10 text-brandGreen-400 border border-brandGreen-500/20 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Interactive Green Habits panel */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-brandGreen-500" />
          <div>
            <h3 className="font-bold text-lg text-white">Eco Habits Checklist</h3>
            <p className="text-xs text-slate-400">Complete items daily to boost your Eco Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <button
              type="button"
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              aria-pressed={habit.completed}
              aria-label={`Toggle habit: ${habit.name}`}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 w-full text-left font-normal ${
                habit.completed 
                  ? 'border-brandGreen-500/40 bg-brandGreen-500/10 text-white' 
                  : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  habit.completed 
                    ? 'border-brandGreen-500 bg-brandGreen-500 text-white' 
                    : 'border-white/20'
                }`}>
                  {habit.completed && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left pr-4">
                  <p className={`text-xs font-semibold ${habit.completed ? 'text-slate-100 line-through' : 'text-slate-200'}`}>
                    {habit.name}
                  </p>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{habit.category}</span>
                </div>
              </div>
              <span className={`text-xs font-bold whitespace-nowrap flex items-center gap-0.5 ${
                habit.completed ? 'text-brandGreen-400' : 'text-slate-400'
              }`}>
                <Plus className="w-3 h-3" />
                {habit.points} pts
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

    </div>
  );
}
