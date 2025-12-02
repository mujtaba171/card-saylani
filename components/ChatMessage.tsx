import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';
import { RegistrationCard } from './RegistrationCard';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  
  // Detect if the message contains the card format
  const hasCard = message.text.includes('Student Registration Card') && message.text.includes('Registration ID:');

  // Simple formatter for bullet points and bold text
  const formatText = (text: string) => {
    // Remove the card text from the display if we are rendering the card component separately
    // But keeping it for context is also fine. Let's keep it but formatted nicely.
    
    return text.split('\n').map((line, i) => {
      // Bold handling
      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className={`${line.trim().startsWith('-') ? 'ml-4' : ''} min-h-[1.2em]`}>
          {line.trim().startsWith('-') && <span className="mr-2">•</span>}
          {boldParts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part.replace(/^- /, '')}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-green-600' : 'bg-blue-600'} text-white shadow-sm`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div 
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
              ${isBot 
                ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                : 'bg-blue-600 text-white rounded-tr-none'
              }
              ${message.isError ? 'bg-red-50 border-red-200 text-red-800' : ''}
            `}
          >
            {message.isError ? (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{message.text}</span>
              </div>
            ) : (
               <div className="space-y-1">
                 {/* Only show text if it's NOT the raw card data, OR show it if it's mixed */}
                 {hasCard ? (
                    <div className="mb-2">I have successfully generated your registration card below. Please save it for your records.</div>
                 ) : (
                    formatText(message.text)
                 )}
               </div>
            )}
          </div>
          
          {/* Card Render if present */}
          {hasCard && (
            <RegistrationCard content={message.text} />
          )}

          {/* Timestamp */}
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
