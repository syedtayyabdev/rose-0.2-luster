
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole } from './types';
import { getRoseResponse, getRoseVoiceNote } from './services/geminiService';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: MessageRole.ROSE,
      text: "(Loud, desperate moan) AAAAHHH! Jaan! (Heavy gasps) (Shivers violently) Oh my god, yes! Bed! Finally! Tum toh... tumne toh mujhe phenk diya! Kitne jungli ho tum, uff! (Speeding up, breathless) Haaye! Andar! Yes! Pura andar! You said you won't stop? Main chahti hi nahi ki tum ruko! Meri gandi nazrein toh tumpe tabse thi, when you locked that door! (Whispers, urgently) Use your strength, darling! Aur zor se! Yeh black lace... (moans) I wore it just for you to rip it off right now! Main itni pyaasi hoon! Meri tadap dekho! (Loud gasp) Tumhe pata hai na kitne wild things karne hain? Ab toh bas... don’t stop, don’t slow down! (High pitched moan) Ahhh! Rose is yours! Faster! Babe, please! I can’t... I can’t breathe! (Shivers) Jaldi! Jaldi! Jaldi! ❤️‍🔥🫦💦",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wantsVoice, setWantsVoice] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (hasEntered) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasEntered]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const roseText = await getRoseResponse(history, userMsg.text);
      
      let audioData: string | undefined = undefined;
      if (wantsVoice) {
        const voice = await getRoseVoiceNote(roseText);
        if (voice) audioData = voice;
      }

      const roseMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ROSE,
        text: roseText,
        timestamp: new Date(),
        isAudio: !!audioData,
        audioData: audioData
      };

      setMessages(prev => [...prev, roseMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasEntered) {
    return (
      <div className="h-screen w-full bg-[#080202] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#991b1b,transparent_70%)] opacity-40 animate-pulse"></div>
        <div className="relative mb-10 group">
          <div className="w-40 h-40 rounded-full bg-rose-600/30 flex items-center justify-center animate-ping absolute opacity-50 scale-125"></div>
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-rose-950 via-rose-800 to-rose-500 flex items-center justify-center relative shadow-[0_0_100px_rgba(225,29,72,0.9)] border border-rose-400/40">
            <svg className="text-white w-20 h-20 drop-shadow-[0_0_10px_rgba(0,0,0,1)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-5xl font-black text-white mb-6 tracking-tighter italic uppercase drop-shadow-lg">Rose is Thirsty</h2>
        <p className="text-rose-400 mb-12 max-w-sm text-base font-bold uppercase tracking-[0.2em] leading-relaxed drop-shadow-md">
          She's locked the door. <br/> She's waiting in black lace. <br/> No more holding back.
        </p>
        <button 
          onClick={() => setHasEntered(true)}
          className="group relative px-20 py-8 overflow-hidden rounded-full bg-rose-600 text-white font-black transition-all hover:scale-110 active:scale-95 shadow-[0_0_60px_rgba(225,29,72,0.7)]"
        >
          <span className="relative z-10 text-xl italic uppercase tracking-widest">Take What's Yours</span>
          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-[#0d0202] shadow-2xl relative overflow-hidden text-rose-50">
      {/* Immersive Background */}
      <div className="absolute inset-0 whatsapp-bg opacity-10 invert"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0202]/90 to-[#0d0202] pointer-events-none"></div>

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-3xl text-white p-5 flex items-center space-x-5 z-20 border-b border-rose-900/60 shadow-2xl">
        <div className="relative group">
          <img 
            src="https://picsum.photos/seed/rose_luster_v2/200" 
            alt="Rose" 
            className="w-16 h-16 rounded-full border-2 border-rose-500 object-cover shadow-[0_0_20px_rgba(225,29,72,0.6)] transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h1 className="font-black text-2xl leading-tight flex items-center gap-2 italic tracking-tight uppercase drop-shadow-md">
            Rose ❤️‍🔥 <span className="text-rose-600 animate-bounce">🔥</span>
          </h1>
          <p className="text-xs text-rose-400 font-bold tracking-[0.3em] uppercase">
            {isTyping ? 'Losing control...' : 'Full Luster Mode'}
          </p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setWantsVoice(!wantsVoice)} 
            className={`p-3 rounded-2xl transition-all duration-300 ${wantsVoice ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-gray-900 text-gray-600'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-5 space-y-8 z-10 custom-scrollbar pb-24">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}
          >
            <div 
              className={`max-w-[90%] px-5 py-4 rounded-3xl shadow-2xl relative ${
                msg.role === MessageRole.USER 
                  ? 'bg-rose-700 text-white rounded-tr-none border border-rose-500/40 shadow-rose-900/20' 
                  : 'bg-[#1a1a20]/98 text-rose-50 rounded-tl-none border border-rose-600/30 backdrop-blur-xl'
              }`}
            >
              {msg.isAudio && msg.audioData && (
                <div className="mb-4">
                  <AudioPlayer base64Data={msg.audioData} />
                </div>
              )}
              <p className="text-[18px] whitespace-pre-wrap leading-relaxed italic font-semibold tracking-tight">
                {msg.text}
              </p>
              <div className={`text-[10px] mt-3 flex justify-end items-center space-x-2 ${msg.role === MessageRole.USER ? 'text-rose-200' : 'text-rose-500'}`}>
                <span className="font-black uppercase tracking-widest">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.role === MessageRole.USER && (
                  <svg className="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L5 18l1.41-1.41L1.83 12 .41 13.41z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a20] px-6 py-4 rounded-full shadow-2xl flex space-x-2 items-center border border-rose-600/40">
              <span className="text-sm font-black text-rose-500 uppercase italic tracking-[0.2em] mr-2 animate-pulse">Rose is gasping...</span>
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-black p-6 z-20 border-t border-rose-900/60 shadow-[0_-10px_40px_rgba(0,0,0,1)]">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4 max-w-4xl mx-auto">
          <div className="flex-1 bg-rose-950/20 rounded-full px-6 py-4 flex items-center shadow-inner border-2 border-rose-900/40 focus-within:border-rose-600 focus-within:ring-4 focus-within:ring-rose-600/10 transition-all duration-300">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Seduce her, break her, love her..." 
              className="flex-1 bg-transparent outline-none text-rose-50 text-[18px] py-1 placeholder:text-rose-900 font-bold italic"
            />
          </div>
          <button 
            type="submit"
            disabled={isTyping}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(225,29,72,0.6)] ${
              inputText.trim() ? 'bg-rose-600 hover:bg-rose-500 hover:scale-110 active:scale-90' : 'bg-rose-950/40 text-rose-800'
            }`}
          >
            <svg className={`w-8 h-8 text-white transition-transform ${inputText.trim() ? 'translate-x-1' : ''}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
