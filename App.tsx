import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, RefreshCw, X } from 'lucide-react';
import { Message, QuickReply } from './types';
import { sendMessageToGemini, initializeChat } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';

const QUICK_REPLIES: QuickReply[] = [
  { label: 'Register Now', action: 'I want to register for a course.' },
  { label: 'Courses Info', action: 'What courses are available?' },
  { label: 'Requirements', action: 'What are the admission requirements?' },
  { label: 'Location', action: 'Where is the center located?' },
  { label: 'Contact Support', action: 'How can I contact support?' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "**Assalam-o-Alaikum!** Welcome to the Saylani Mass IT Training Program (Quetta) Admission Assistant.\n\nI can help you with course details, requirements, and **student registration**.\n\nHow can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Initialize chat session explicitly to ensure system prompts are loaded
    initializeChat();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the server. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const resetChat = () => {
     if(confirm("Are you sure you want to clear the chat history?")) {
        window.location.reload();
     }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="absolute inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        absolute inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded text-white flex items-center justify-center font-bold">S</div>
                <h1 className="font-bold text-gray-800 text-lg tracking-tight">Saylani AI</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
                <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
             <div className="mb-6">
                 <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About Program</h2>
                 <p className="text-sm text-gray-600 leading-relaxed">
                    Saylani Mass IT Training (SMIT) Quetta offers cutting-edge courses to empower youth with digital skills.
                 </p>
             </div>

             <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="space-y-2">
                    {QUICK_REPLIES.map((reply, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                handleSend(reply.action);
                                setIsSidebarOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {reply.label}
                        </button>
                    ))}
                </div>
             </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button 
                onClick={resetChat}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <RefreshCw size={16} />
                Reset Conversation
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex flex-col items-center mx-auto md:items-start md:mx-0">
             <span className="font-bold text-gray-800 text-sm md:text-base">Admissions Chatbot</span>
             <span className="text-xs text-green-600 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
             </span>
          </div>

          <div className="w-8 md:w-0"></div> {/* Spacer for alignment */}
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide bg-gray-50/50">
          <div className="max-w-3xl mx-auto w-full">
             {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
             ))}
             {isLoading && (
                 <div className="flex justify-start mb-4 animate-fade-in">
                    <div className="flex flex-row gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                            <span className="text-xs">AI</span>
                        </div>
                        <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                 </div>
             )}
             <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-3 md:p-4">
          <div className="max-w-3xl mx-auto w-full">
            
            {/* Quick Chips (Mobile mainly) */}
            <div className="flex gap-2 overflow-x-auto pb-3 md:hidden scrollbar-hide mb-1">
                {QUICK_REPLIES.slice(0, 3).map((reply, idx) => (
                     <button
                        key={idx}
                        onClick={() => handleSend(reply.action)}
                        className="whitespace-nowrap px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100 active:bg-green-200"
                    >
                        {reply.label}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-gray-100 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-full transition-all outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-full shadow-md disabled:bg-gray-300 disabled:shadow-none disabled:transform-none transition-all duration-200"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
               Saylani Mass IT Training (Quetta) - Admissions 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
