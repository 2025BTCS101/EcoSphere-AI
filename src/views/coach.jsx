import { useState, useRef, useEffect } from 'react';
import { useEco } from '../context/EcoContext';
import { getSustainabilityAdvice } from '../services/gemini';
import GlassCard from '../components/glass-card';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  ArrowRight,
  Trash2
} from 'lucide-react';

const createUserMsg = (text) => ({
  id: Date.now().toString() + '-user',
  role: 'user',
  text,
  timestamp: new Date().toISOString()
});

const createModelMsg = (text) => ({
  id: Date.now().toString() + '-model',
  role: 'model',
  text,
  timestamp: new Date().toISOString()
});

const createErrorMsg = () => ({
  id: Date.now().toString() + '-error',
  role: 'model',
  text: 'Sorry, I failed to process that query. Please check your network connection or Gemini API credentials.',
  timestamp: new Date().toISOString()
});

const createWelcomeMsg = () => ({
  id: 'welcome',
  role: 'model',
  text: "Welcome back! Let's discuss how to optimize your carbon footprint. How can I help you today?",
  timestamp: new Date().toISOString()
});

export default function Coach() {
  const { 
    apiKey, 
    chatMessages, 
    setChatMessages, 
    currentEmissions 
  } = useEco();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg = createUserMsg(query);

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Fetch from Gemini Service
      const responseText = await getSustainabilityAdvice(apiKey, updatedMessages, currentEmissions);
      
      // 3. Add Model Response
      const modelMsg = createModelMsg(responseText);
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = createErrorMsg();
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      setChatMessages([createWelcomeMsg()]);
    }
  };

  // Quick Suggestion Prompts
  const quickSuggestions = [
    { label: 'Optimize commute carbon', query: 'How can I optimize my transport footprint?' },
    { label: 'Eco-friendly diet ideas', query: 'What are the best food habits to lower carbon?' },
    { label: 'Energy savings tips', query: 'Give me smart ways to lower my home electricity usage.' },
    { label: 'Analyze my current footprint', query: 'Can you analyze my current carbon numbers and prioritize tasks?' }
  ];

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col gap-6">
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Left Side: Coach Meta Stats (1/4 columns) */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-6">
          <GlassCard className="p-5 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brandGreen-400">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Coach Profile</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                EcoSphere AI is trained to read carbon calculation factors and offer custom energy-saving, diet, and transit tips.
              </p>
              
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Context Scope</span>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Road travel:</span>
                    <span className="font-semibold text-white">{currentEmissions.transport} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home energy:</span>
                    <span className="font-semibold text-white">{currentEmissions.electricity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food diet:</span>
                    <span className="font-semibold text-white">{currentEmissions.food} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Carbon:</span>
                    <span className="font-semibold text-brandGreen-400">{currentEmissions.total} kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-900/20 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat Logs</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Chat Board Panel (3/4 columns) */}
        <GlassCard className="lg:col-span-3 flex flex-col h-full overflow-hidden p-0 border-white/10">
          
          {/* Chat Header Info */}
          <div className="px-6 py-4 border-b border-darkBorder flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brandGreen-500/10 border border-brandGreen-500/20 flex items-center justify-center text-brandGreen-500 shadow-glow">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#090D16] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Sustainability Expert</h4>
                <span className="text-[10px] text-brandGreen-400 font-semibold uppercase tracking-wider">Active Assistant</span>
              </div>
            </div>
            
            <span className="text-[10px] text-slate-500 font-semibold bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              {apiKey ? 'Gemini 1.5 Flash' : 'Simulated Sandbox Mode'}
            </span>
          </div>

          {/* Chat Message Lists */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg) => {
              const isBot = msg.role === 'model';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    isBot 
                      ? 'bg-brandGreen-500/10 border-brandGreen-500/20 text-brandGreen-500' 
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`rounded-2xl p-4 text-sm leading-relaxed border ${
                    isBot 
                      ? 'bg-white/5 border-white/5 text-slate-200' 
                      : 'bg-brandGreen-600 border-brandGreen-500 text-white shadow-glow'
                  }`}>
                    {/* Clean formatted Markdown lines rendering */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI is thinking/loading state bubble */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-brandGreen-500/10 border border-brandGreen-500/20 flex items-center justify-center text-brandGreen-500 animate-spin">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-brandGreen-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-brandGreen-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-brandGreen-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions container */}
          {chatMessages.length <= 1 && (
            <div className="px-6 py-2 border-t border-darkBorder space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Suggested Questions</span>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-brandGreen-500/30 hover:bg-brandGreen-500/5 transition-all flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Form inputs */}
          <div className="p-4 border-t border-darkBorder bg-white/5">
            <div className="relative flex items-center">
              <textarea
                id="chat-textarea"
                aria-label="Sustainability query input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask your coach anything about carbon offsets or energy conservation..."
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-14 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none transition-all focus:border-brandGreen-500/50 focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 p-2 rounded-lg bg-brandGreen-600 text-white hover:bg-brandGreen-500 hover:shadow-glow disabled:bg-white/5 disabled:text-slate-600 disabled:shadow-none transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Keep prompts short for faster Gemini API parsing. Press Enter to send, Shift+Enter for newline.
            </p>
          </div>

        </GlassCard>

      </div>

    </div>
  );
}
