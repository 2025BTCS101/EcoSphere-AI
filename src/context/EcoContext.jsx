import React, { createContext, useContext, useState, useEffect } from 'react';

const EcoContext = createContext();

// Average emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  transport: {
    suv: 0.25,        // per km
    sedan: 0.17,      // per km
    ev: 0.05,         // per km (grid charging average)
    transit: 0.04,    // per km (bus/train average)
    flight: 0.15,      // per km
  },
  electricity: 0.475, // kg CO2e per kWh
  food: {
    vegan: 2.0,       // kg CO2e per day
    vegetarian: 3.5,  // kg CO2e per day
    balanced: 5.5,    // kg CO2e per day
    highMeat: 8.0,    // kg CO2e per day
  },
  shopping: 0.12,     // kg CO2e per $ spent
};

// Initial realistic mock data for default dashboard visualization
const INITIAL_HISTORICAL_DATA = [
  { month: 'Jan', transport: 320, electricity: 190, food: 170, shopping: 90, total: 770 },
  { month: 'Feb', transport: 290, electricity: 180, food: 165, shopping: 85, total: 720 },
  { month: 'Mar', transport: 270, electricity: 160, food: 170, shopping: 80, total: 680 },
  { month: 'Apr', transport: 210, electricity: 150, food: 155, shopping: 70, total: 585 },
  { month: 'May', transport: 180, electricity: 140, food: 150, shopping: 65, total: 535 },
  { month: 'Jun', transport: 150, electricity: 130, food: 150, shopping: 60, total: 490 },
];

const DEFAULT_HABITS = [
  { id: '1', name: 'Used public transit instead of driving', points: 30, category: 'transport', completed: false },
  { id: '2', name: 'Had a fully plant-based meal day', points: 25, category: 'food', completed: false },
  { id: '3', name: 'Unplugged vampire electronics overnight', points: 15, category: 'electricity', completed: false },
  { id: '4', name: 'Brought reusable bags for shopping', points: 10, category: 'shopping', completed: false },
  { id: '5', name: 'Planted a native tree / supported green project', points: 100, category: 'general', completed: false },
];

export const EcoProvider = ({ children }) => {
  // Credentials (saved locally)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    const config = localStorage.getItem('firebase_config');
    return config ? JSON.parse(config) : { apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' };
  });

  // Carbon calculator form input state
  const [calculatorInputs, setCalculatorInputs] = useState(() => {
    const saved = localStorage.getItem('eco_calculator_inputs');
    return saved ? JSON.parse(saved) : {
      transportDistance: 350, // km/month
      vehicleType: 'sedan',
      flightDistance: 0, // km/month
      electricityKwh: 220, // kWh/month
      dietType: 'balanced',
      shoppingSpend: 150, // $/month
    };
  });

  // Current emissions totals (kg CO2e / month)
  const [currentEmissions, setCurrentEmissions] = useState({
    transport: 0,
    electricity: 0,
    food: 0,
    shopping: 0,
    total: 0
  });

  // Historical lists & habits
  const [historicalData, setHistoricalData] = useState(() => {
    const saved = localStorage.getItem('eco_historical_data');
    return saved ? JSON.parse(saved) : INITIAL_HISTORICAL_DATA;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('eco_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [ecoScore, setEcoScore] = useState(650);

  // Chat message state for AI coach
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('eco_chat_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        role: 'model',
        text: 'Hello! I am your EcoSphere AI Sustainability Coach. I have analyzed your carbon calculator profile. You are doing well, but we can optimize your transport and dietary habits. Ask me anything about reducing your carbon footprint!',
        timestamp: new Date().toISOString()
      }
    ];
  });

  // Re-calculate carbon footprint whenever inputs change
  useEffect(() => {
    const tEmissions = Math.round(
      (calculatorInputs.transportDistance * EMISSION_FACTORS.transport[calculatorInputs.vehicleType]) +
      (calculatorInputs.flightDistance * EMISSION_FACTORS.transport.flight)
    );
    const eEmissions = Math.round(calculatorInputs.electricityKwh * EMISSION_FACTORS.electricity);
    const fEmissions = Math.round(EMISSION_FACTORS.food[calculatorInputs.dietType] * 30); // monthly
    const sEmissions = Math.round(calculatorInputs.shoppingSpend * EMISSION_FACTORS.shopping);

    const total = tEmissions + eEmissions + fEmissions + sEmissions;

    setCurrentEmissions({
      transport: tEmissions,
      electricity: eEmissions,
      food: fEmissions,
      shopping: sEmissions,
      total
    });

    localStorage.setItem('eco_calculator_inputs', JSON.stringify(calculatorInputs));
  }, [calculatorInputs]);

  // Recalculate Eco Score dynamically
  useEffect(() => {
    // Standard scale: 1000 points max.
    // 0 footprint = 850 base points.
    // Footprint penalty: decreases score. E.g. penalty = total footprint / 2.
    // Active habits completed: adds points.
    const basePoints = 850;
    const footprintPenalty = currentEmissions.total * 0.5; // average ~500kg means 250 penalty
    const completedHabitsPoints = habits
      .filter(h => h.completed)
      .reduce((sum, h) => sum + h.points, 0);

    const score = Math.max(50, Math.min(1000, Math.round(basePoints - footprintPenalty + completedHabitsPoints)));
    setEcoScore(score);
  }, [currentEmissions, habits]);

  // Sync state to local storage for Sandbox persistence
  useEffect(() => {
    localStorage.setItem('eco_historical_data', JSON.stringify(historicalData));
  }, [historicalData]);

  useEffect(() => {
    localStorage.setItem('eco_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('eco_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Update calculator inputs
  const updateInputs = (newInputs) => {
    setCalculatorInputs(prev => ({ ...prev, ...newInputs }));
  };

  // Log a habit completion
  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, completed: !h.completed };
      }
      return h;
    }));
  };

  // Save current calculator results to history logs
  const logCurrentToHistory = (customMonth) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = customMonth || monthNames[new Date().getMonth()];
    
    setHistoricalData(prev => {
      // If month already exists, overwrite it, else append
      const existsIdx = prev.findIndex(d => d.month === label);
      const entry = { month: label, ...currentEmissions };
      if (existsIdx > -1) {
        const copy = [...prev];
        copy[existsIdx] = entry;
        return copy;
      }
      return [...prev, entry];
    });
  };

  // Ranks configuration
  const getEcoRank = (score) => {
    if (score >= 800) return { title: 'Eco Hero', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (score >= 500) return { title: 'Climate Guardian', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
    return { title: 'Green Citizen', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
  };

  // Trees absorbing equivalency
  // 1 adult tree absorbs ~22kg of CO2 per year, which is ~1.83kg per month.
  // We compute monthly trees needed to offset.
  const treesEquivalent = (currentEmissions.total / 1.83).toFixed(1);

  // Clear all data & reset to defaults
  const resetData = () => {
    localStorage.removeItem('eco_calculator_inputs');
    localStorage.removeItem('eco_historical_data');
    localStorage.removeItem('eco_habits');
    localStorage.removeItem('eco_chat_messages');
    
    setCalculatorInputs({
      transportDistance: 350,
      vehicleType: 'sedan',
      flightDistance: 0,
      electricityKwh: 220,
      dietType: 'balanced',
      shoppingSpend: 150,
    });
    setHistoricalData(INITIAL_HISTORICAL_DATA);
    setHabits(DEFAULT_HABITS);
    setChatMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Hello! I am your EcoSphere AI Sustainability Coach. I have analyzed your carbon calculator profile. You are doing well, but we can optimize your transport and dietary habits. Ask me anything about reducing your carbon footprint!',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <EcoContext.Provider value={{
      apiKey,
      setApiKey,
      firebaseConfig,
      setFirebaseConfig,
      calculatorInputs,
      updateInputs,
      currentEmissions,
      ecoScore,
      getEcoRank,
      historicalData,
      setHistoricalData,
      habits,
      toggleHabit,
      treesEquivalent,
      chatMessages,
      setChatMessages,
      logCurrentToHistory,
      resetData
    }}>
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => useContext(EcoContext);
