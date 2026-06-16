import { useState, useEffect } from 'react';
import { EcoProvider } from './context/EcoContext';
import { initFirebase } from './services/firebase';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Dashboard from './views/dashboard';
import Calculator from './views/calculator';
import Coach from './views/coach';
import Predictor from './views/predictor';
import Settings from './views/settings';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [currentView, setView] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize Firebase dynamically on load if credentials exist
  useEffect(() => {
    const savedConfig = localStorage.getItem('firebase_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.apiKey && config.projectId) {
          initFirebase(config);
        }
      } catch (err) {
        console.error("Auto Firebase initialization failed:", err);
      }
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calculator':
        return <Calculator />;
      case 'coach':
        return <Coach />;
      case 'predictor':
        return <Predictor />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleSetView = (viewId) => {
    setView(viewId);
    setMobileSidebarOpen(false);
  };

  return (
    <EcoProvider>
      <div className="flex min-h-screen bg-darkBg text-slate-100 font-sans">
        
        {/* Desktop Sidebar (visible on medium & large screens) */}
        <div className="hidden md:block">
          <Sidebar currentView={currentView} setView={handleSetView} />
        </div>

        {/* Mobile Sidebar Navigation Drawer (slides-in over content) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-[#090D16]/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            
            {/* Sidebar drawer container */}
            <div className="relative flex flex-col w-64 max-w-xs bg-darkBg border-r border-darkBorder animate-[slideIn_0.3s_ease-out]">
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar currentView={currentView} setView={handleSetView} />
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
          
          {/* Header containing page titles & mobile menu trigger */}
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden ml-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex-grow">
              <Header currentView={currentView} />
            </div>
          </div>

          {/* Dynamic view screen viewport */}
          <main className="flex-grow overflow-x-hidden overflow-y-auto">
            {renderView()}
          </main>
        </div>

      </div>
    </EcoProvider>
  );
}
