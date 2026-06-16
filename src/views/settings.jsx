import { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { initFirebase } from '../services/firebase';
import GlassCard from '../components/glass-card';
import { 
  Key, 
  Database, 
  Save, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink 
} from 'lucide-react';

export default function Settings() {
  const { 
    apiKey, 
    setApiKey, 
    firebaseConfig, 
    setFirebaseConfig,
    resetData 
  } = useEco();

  // Local inputs before saving
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localFbConfig, setLocalFbConfig] = useState(firebaseConfig);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fbStatus, setFbStatus] = useState(null); // 'success', 'failed', null

  const handleFbConfigChange = (field, val) => {
    setLocalFbConfig(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    // 1. Save Gemini Key
    if (localApiKey && !localApiKey.trim().startsWith('AIzaSy')) {
      alert("WARNING: The Google Gemini API key typically starts with 'AIzaSy'. Please check your credentials.");
    }
    localStorage.setItem('gemini_api_key', localApiKey);
    setApiKey(localApiKey);

    // 2. Save Firebase Config
    localStorage.setItem('firebase_config', JSON.stringify(localFbConfig));
    setFirebaseConfig(localFbConfig);

    // 3. Test Firebase Connection
    if (localFbConfig.apiKey && localFbConfig.projectId) {
      const initResult = initFirebase(localFbConfig);
      if (initResult.isConnected) {
        setFbStatus('success');
      } else {
        setFbStatus('failed');
      }
    } else {
      setFbStatus(null);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFactoryReset = () => {
    if (window.confirm("CRITICAL WARNING: This will delete ALL custom credentials, carbon inputs, local history, and chat logs. Proceed?")) {
      resetData();
      setLocalApiKey('');
      setLocalFbConfig({ apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' });
      setFbStatus(null);
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Setup Forms (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GEMINI CREDENTIAL CARD */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brandGreen-500/10 p-2.5 rounded-xl border border-brandGreen-500/20 text-brandGreen-500 shadow-glow">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Google Gemini Integration</h3>
                <p className="text-xs text-slate-400">Add an API Key to enable the real-time AI Sustainability Coach</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="gemini-api-key" className="text-sm font-semibold text-slate-300">Gemini API Key</label>
                <input 
                  id="gemini-api-key"
                  type="password"
                  placeholder="Paste your AI Studio API key here (AIzaSy...)"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="glass-input"
                />
                <span className="text-[10px] text-slate-500">
                  Your credentials are saved strictly inside your local browser storage and never uploaded to external servers.
                </span>
              </div>
            </div>
          </GlassCard>

          {/* FIREBASE CREDENTIAL CARD */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Firebase Cloud Storage Configuration</h3>
                <p className="text-xs text-slate-400">Synchronize calculations and logs dynamically with Firebase Firestore</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-api-key" className="text-xs font-semibold text-slate-400">API Key</label>
                <input 
                  id="fb-api-key"
                  type="text"
                  placeholder="apiKey"
                  value={localFbConfig.apiKey}
                  onChange={(e) => handleFbConfigChange('apiKey', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-project-id" className="text-xs font-semibold text-slate-400">Project ID</label>
                <input 
                  id="fb-project-id"
                  type="text"
                  placeholder="projectId"
                  value={localFbConfig.projectId}
                  onChange={(e) => handleFbConfigChange('projectId', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-auth-domain" className="text-xs font-semibold text-slate-400">Auth Domain</label>
                <input 
                  id="fb-auth-domain"
                  type="text"
                  placeholder="authDomain"
                  value={localFbConfig.authDomain}
                  onChange={(e) => handleFbConfigChange('authDomain', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-storage-bucket" className="text-xs font-semibold text-slate-400">Storage Bucket</label>
                <input 
                  id="fb-storage-bucket"
                  type="text"
                  placeholder="storageBucket"
                  value={localFbConfig.storageBucket}
                  onChange={(e) => handleFbConfigChange('storageBucket', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-messaging-sender-id" className="text-xs font-semibold text-slate-400">Messaging Sender ID</label>
                <input 
                  id="fb-messaging-sender-id"
                  type="text"
                  placeholder="messagingSenderId"
                  value={localFbConfig.messagingSenderId}
                  onChange={(e) => handleFbConfigChange('messagingSenderId', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fb-app-id" className="text-xs font-semibold text-slate-400">App ID</label>
                <input 
                  id="fb-app-id"
                  type="text"
                  placeholder="appId"
                  value={localFbConfig.appId}
                  onChange={(e) => handleFbConfigChange('appId', e.target.value)}
                  className="glass-input py-2 text-xs"
                />
              </div>
            </div>

            {fbStatus === 'success' && (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-brandGreen-400 bg-brandGreen-500/10 border border-brandGreen-500/30 rounded-xl p-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Firestore connection successful! Running in Cloud database Mode.</span>
              </div>
            )}

            {fbStatus === 'failed' && (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 border border-red-500/30 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Failed connection to Firebase. Please check database project IDs or internet.</span>
              </div>
            )}
          </GlassCard>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl">
            <button
              type="button"
              onClick={handleFactoryReset}
              className="glass-btn-danger text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Factory Hard Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="glass-btn-primary text-xs font-semibold py-2 px-6"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configurations</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-brandGreen-400 bg-brandGreen-500/10 border border-brandGreen-500/30 rounded-2xl p-3 text-center justify-center animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>Configuration successfully saved and synced!</span>
            </div>
          )}
        </div>

        {/* Right Side: Setup Instructions Guidance (1/3 column) */}
        <div className="space-y-6">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-200">
                <HelpCircle className="w-5 h-5 text-brandGreen-500" />
                <h4 className="font-bold text-sm">Integration Guide</h4>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-slate-400">
                <div>
                  <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-brandGreen-400 border border-brandGreen-500/20">1</span>
                    Get Gemini API Key
                  </h5>
                  <p>Go to Google AI Studio, sign in with your Google Account, and click **Create API Key**. It is completely free for standard queries.</p>
                  <a 
                    href="https://aistudio.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brandGreen-400 hover:text-brandGreen-300 font-semibold inline-flex items-center gap-1 mt-1.5"
                  >
                    <span>Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h5 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-brandGreen-400 border border-brandGreen-500/20">2</span>
                    Setup Firebase Console
                  </h5>
                  <p>Create a project on the Firebase console. Add a web app, and copy the config details generated under **Project Settings**.</p>
                  <a 
                    href="https://console.firebase.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brandGreen-400 hover:text-brandGreen-300 font-semibold inline-flex items-center gap-1 mt-1.5"
                  >
                    <span>Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-brandGreen-500/5 rounded-xl border border-brandGreen-500/10 p-4 text-[10px] text-slate-500 mt-6 leading-relaxed">
              If left empty, EcoSphere AI defaults back to **Sandbox Mode**, drawing from rules engines to model forecasts and converse. Ideal for standalone hackathon deployment checks.
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
