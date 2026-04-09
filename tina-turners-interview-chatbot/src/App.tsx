import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, RefreshCcw, ChevronRight, Briefcase, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants/interview';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function App() {
  const [role, setRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-NZ';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        setMicError(null);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicError('Microphone access denied. Please enable it in your browser settings.');
        } else {
          setMicError(`Speech error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    setMicError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = async () => {
    if (!role.trim()) return;
    setIsStarted(true);
    setIsLoading(true);
    
    try {
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: [],
      });

      const message = `I am interested in the role of: ${role}. Please begin the interview.`;
      const result = await chatRef.current.sendMessage({ message });
      
      setMessages([
        { role: 'user', parts: [{ text: `I am interested in the role of: ${role}` }] },
        { role: 'model', parts: [{ text: result.text }] }
      ]);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: input });
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: result.text }] }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRole('');
    setIsStarted(false);
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md p-8 rounded-[40px] neumorphic-flat text-center space-y-8"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl neumorphic-button flex items-center justify-center text-brand-blue">
              <Briefcase size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Interview Prep</h1>
              <p className="text-slate-500 font-medium">Retraining for Turners Car Insurance</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter the role you're applying for..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="w-full px-6 py-4 rounded-2xl neumorphic-inset border-none focus:ring-2 focus:ring-brand-blue/40 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleStart}
                disabled={!role.trim()}
                className="w-full py-4 rounded-2xl neumorphic-button text-brand-blue font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Start Interview with Tina
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 pt-4">
              Part of the Digital Transformation Training Program
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl h-[85vh] flex flex-col rounded-[40px] neumorphic-flat overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200/50 flex items-center justify-between bg-white/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl neumorphic-button flex items-center justify-center text-brand-blue">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Tina</h2>
                  <p className="text-xs text-brand-blue font-semibold uppercase tracking-wider">Interviewing for {role}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl neumorphic-button text-slate-400 hover:text-brand-blue transition-colors"
                title="Restart Interview"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 neumorphic-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-lg neumorphic-button flex-shrink-0 flex items-center justify-center text-brand-blue mt-0">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className={`px-5 py-3 ${msg.role === 'model' ? 'bubble-tina' : 'bubble-user'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.parts[0].text}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg neumorphic-button flex-shrink-0 flex items-center justify-center text-slate-400 mt-0">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg neumorphic-button flex items-center justify-center text-brand-blue mt-0">
                      <Bot size={16} />
                    </div>
                    <div className="bubble-tina px-5 py-3 flex gap-1 items-center">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/30 backdrop-blur-sm border-t border-slate-200/50 relative">
              {micError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-6 right-6 bg-red-50 text-red-600 text-xs py-2 px-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-between"
                >
                  <span>{micError}</span>
                  <button onClick={() => setMicError(null)} className="ml-2 font-bold">×</button>
                </motion.div>
              )}
              <div className="flex gap-4">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full px-6 py-4 pr-14 rounded-2xl neumorphic-inset border-none focus:ring-2 focus:ring-brand-blue/40 outline-none transition-all placeholder:text-slate-400 text-sm"
                  />
                  <button
                    onClick={toggleListening}
                    className={`absolute right-2 p-3 rounded-xl transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                        : 'text-slate-400 hover:text-brand-blue'
                    }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-14 h-14 rounded-2xl neumorphic-button flex items-center justify-center text-brand-blue disabled:opacity-50 transition-all"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


