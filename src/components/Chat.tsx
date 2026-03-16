import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ShieldAlert } from 'lucide-react';
import Markdown from 'react-markdown';
import { createTaxChat } from '../services/taxAi';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export default function Chat({ jurisdiction }: { jurisdiction: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Welcome to EuroTax AI. I am your dedicated tax and corporate structuring consultant for **${jurisdiction}** and the broader European Economic Area.\n\nHow may I assist you today with company formation, tax optimization, or compliance?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Store the chat instance in a ref so it persists across renders
  const chatRef = useRef<any>(null);

  useEffect(() => {
    // Initialize chat when jurisdiction changes
    chatRef.current = createTaxChat(jurisdiction);
    
    // Add a system message indicating context switch if it's not the first load
    if (messages.length > 1) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: `*Jurisdiction context updated to **${jurisdiction}**.*`
      }]);
    }
  }, [jurisdiction]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createTaxChat(jurisdiction);
      }

      const stream = await chatRef.current.sendMessageStream({ message: userMsg });
      
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'ai', 
        content: 'I encountered an error processing your request. Please ensure your API key is valid and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-sm bg-white flex-shrink-0 flex items-center justify-center mt-1">
                    <ShieldAlert className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-6 py-4",
                  msg.role === 'user' 
                    ? "bg-white text-black rounded-tr-sm" 
                    : "bg-surface border border-white/5 rounded-tl-sm text-zinc-300"
                )}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden focus-within:border-white/30 transition-colors"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tax optimization, VAT, or company formation..."
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-white text-black disabled:opacity-50 disabled:bg-white/10 disabled:text-white transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-zinc-600 uppercase tracking-widest">
            AI-generated advice. Consult a certified professional before execution.
          </div>
        </div>
      </div>
    </div>
  );
}
