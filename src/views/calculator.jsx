import { useState } from 'react';
import { useEco } from '../context/EcoContext';
import GlassCard from '../components/glass-card';
import { 
  Car, 
  Flame, 
  Utensils, 
  ShoppingBag, 
  Save, 
  Plane,
  CheckCircle,
  TrendingDown
} from 'lucide-react';

export default function Calculator() {
  const { 
    calculatorInputs, 
    updateInputs, 
    currentEmissions, 
    logCurrentToHistory, 
    ecoScore
  } = useEco();

  const [logSuccess, setLogSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Jun');

  const handleInputChange = (field, value) => {
    updateInputs({ [field]: Number(value) || value });
  };

  const handleSaveLogs = () => {
    logCurrentToHistory(selectedMonth);
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  // Diet configuration details
  const diets = [
    { id: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products' },
    { id: 'vegetarian', label: 'Vegetarian', emoji: '🥚', desc: 'No meat, includes dairy/eggs' },
    { id: 'balanced', label: 'Balanced', emoji: '🥩', desc: 'Moderate meat & vegetables' },
    { id: 'highMeat', label: 'High Meat', emoji: '🍔', desc: 'Frequent meat consumption' },
  ];

  // Vehicle configuration details
  const vehicles = [
    { id: 'suv', label: 'SUV / Truck', desc: 'High emissions gas vehicle' },
    { id: 'sedan', label: 'Sedan / Hatchback', desc: 'Standard gas vehicle' },
    { id: 'ev', label: 'Electric Vehicle', desc: 'Zero tailpipe, minor grid emissions' },
    { id: 'transit', label: 'Public Transit', desc: 'Bus, trains, and subways' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-brandGreen-500/10 border border-brandGreen-500/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brandGreen-500/20 p-2 rounded-xl text-brandGreen-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Interactive Carbon Modeler</h4>
            <p className="text-xs text-slate-400">Drag sliders and change options to instantly recalculate your score and footprint.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Projected Eco Score</span>
          <p className="text-lg font-extrabold text-brandGreen-400 glow-text-green">{ecoScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Forms (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TRANSPORT SECTION */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Transport & Commute</h3>
                <p className="text-xs text-slate-400">Your daily travel and flight habits</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Ground Commute Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label htmlFor="range-road-travel" className="text-slate-300 font-medium">Monthly Road Travel</label>
                  <span className="text-brandGreen-400 font-semibold">{calculatorInputs.transportDistance} km</span>
                </div>
                <input 
                  id="range-road-travel"
                  type="range" 
                  min="0" 
                  max="3000" 
                  step="50"
                  value={calculatorInputs.transportDistance}
                  onChange={(e) => handleInputChange('transportDistance', e.target.value)}
                  className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Vehicle Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Primary Transport Mode</label>
                <div className="grid grid-cols-2 gap-3" role="listbox" aria-label="Vehicle type selector">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="option"
                      aria-selected={calculatorInputs.vehicleType === v.id}
                      onClick={() => handleInputChange('vehicleType', v.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                        calculatorInputs.vehicleType === v.id
                          ? 'border-brandGreen-500 bg-brandGreen-500/10 text-white'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-sm">{v.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flights Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label htmlFor="range-air-travel" className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Plane className="w-4 h-4 text-blue-400" /> Air Travel (Monthly Average)
                  </label>
                  <span className="text-brandGreen-400 font-semibold">{calculatorInputs.flightDistance} km</span>
                </div>
                <input 
                  id="range-air-travel"
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={calculatorInputs.flightDistance}
                  onChange={(e) => handleInputChange('flightDistance', e.target.value)}
                  className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Typical short flight: 500km, long flight: 2500km</span>
              </div>
            </div>
          </GlassCard>

          {/* HOME ENERGY SECTION */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Home Electricity</h3>
                <p className="text-xs text-slate-400">Residential utilities and energy grid factors</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label htmlFor="range-electricity" className="text-slate-300 font-medium">Electricity Usage</label>
                  <span className="text-brandGreen-400 font-semibold">{calculatorInputs.electricityKwh} kWh/month</span>
                </div>
                <input 
                  id="range-electricity"
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10"
                  value={calculatorInputs.electricityKwh}
                  onChange={(e) => handleInputChange('electricityKwh', e.target.value)}
                  className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Average residential usage is ~200-450 kWh per month depending on region.</span>
              </div>
            </div>
          </GlassCard>

          {/* DIET & CONSUMER GOODS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FOOD SECTION */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-md text-white">Food Habits</h3>
                  <p className="text-[11px] text-slate-400">Daily diet carbon metrics</p>
                </div>
              </div>

              <div className="space-y-3" role="listbox" aria-label="Diet type selector">
                {diets.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    role="option"
                    aria-selected={calculatorInputs.dietType === d.id}
                    onClick={() => handleInputChange('dietType', d.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all duration-300 ${
                      calculatorInputs.dietType === d.id
                        ? 'border-brandGreen-500 bg-brandGreen-500/10 text-white'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{d.emoji}</span>
                    <div>
                      <div className="font-semibold text-xs text-white">{d.label}</div>
                      <div className="text-[9px] text-slate-400">{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* SHOPPING SECTION */}
            <GlassCard className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 text-purple-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md text-white">Shopping & Spending</h3>
                    <p className="text-[11px] text-slate-400">Consumer electronics, clothes, and tools</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label htmlFor="range-shopping" className="text-slate-300 font-medium">Monthly Discretionary Spend</label>
                      <span className="text-brandGreen-400 font-semibold">${calculatorInputs.shoppingSpend}</span>
                    </div>
                    <input 
                      id="range-shopping"
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="50"
                      value={calculatorInputs.shoppingSpend}
                      onChange={(e) => handleInputChange('shoppingSpend', e.target.value)}
                      className="w-full accent-brandGreen-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 mt-6 leading-relaxed border-t border-white/5 pt-3">
                Calculated based on lifecycle manufacturing footprint factor per dollar spent (raw material extraction + logistics + retail).
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Panel: Footprint Breakdown Metrics (1/3 column) */}
        <div className="space-y-6">
          <GlassCard className="p-6 sticky top-24 border-brandGreen-500/20">
            <h3 className="font-bold text-lg text-white mb-4">Carbon Output Analysis</h3>
            
            {/* Total Footprint Indicator */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-brandGreen-500/5 filter blur-xl animate-pulse-glow"></div>
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">Total Monthly Emissions</span>
              <p className="text-4xl font-extrabold text-white mt-1">
                {currentEmissions.total} <span className="text-sm text-brandGreen-400">kg CO2e</span>
              </p>
              <p className="text-[10px] text-slate-500">equivalent to {Math.round(currentEmissions.total * 12)} kg CO2e / year</p>
            </div>

            {/* Progress breakdown items */}
            <div className="space-y-4 mt-6">
              {/* Transport progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span>Transport</span>
                  <span>{currentEmissions.transport} kg CO2e</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentEmissions.transport / Math.max(1, currentEmissions.total)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Energy progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Energy</span>
                  <span>{currentEmissions.electricity} kg CO2e</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentEmissions.electricity / Math.max(1, currentEmissions.total)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Food progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Food / Diet</span>
                  <span>{currentEmissions.food} kg CO2e</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentEmissions.food / Math.max(1, currentEmissions.total)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Shopping progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span>Shopping</span>
                  <span>{currentEmissions.shopping} kg CO2e</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentEmissions.shopping / Math.max(1, currentEmissions.total)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Logging Action */}
            <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
              <label htmlFor="select-month" className="text-xs font-medium text-slate-400 block">Select Month to Log Data</label>
              <div className="flex gap-2">
                <select 
                  id="select-month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-xs flex-1 outline-none focus:border-brandGreen-500"
                >
                  <option value="Jan" className="bg-darkBg">January</option>
                  <option value="Feb" className="bg-darkBg">February</option>
                  <option value="Mar" className="bg-darkBg">March</option>
                  <option value="Apr" className="bg-darkBg">April</option>
                  <option value="May" className="bg-darkBg">May</option>
                  <option value="Jun" className="bg-darkBg">June</option>
                  <option value="Jul" className="bg-darkBg">July</option>
                  <option value="Aug" className="bg-darkBg">August</option>
                  <option value="Sep" className="bg-darkBg">September</option>
                  <option value="Oct" className="bg-darkBg">October</option>
                  <option value="Nov" className="bg-darkBg">November</option>
                  <option value="Dec" className="bg-darkBg">December</option>
                </select>

                <button
                  type="button"
                  onClick={handleSaveLogs}
                  className="glass-btn-primary py-2 px-4 text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Log Entry</span>
                </button>
              </div>

              {logSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-brandGreen-400 bg-brandGreen-500/10 border border-brandGreen-500/30 rounded-xl p-2.5 animate-pulse">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Logged successfully! Check Dashboard.</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
