import React, { useState, useRef, useEffect } from 'react';
import { useStore, SlackMessage } from '../store';
import { slackAI } from '../api';
import { Send, Hash, Brain, Laptop, Info, ArrowUpRight } from 'lucide-react';

export const SlackSimulator: React.FC = () => {
  const { slackThread, addSlackMessage, onboardingRole, userPersona } = useStore();
  const [inputText, setInputText] = useState('');
  const [botIsTyping, setBotIsTyping] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [slackThread, botIsTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText('');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg: SlackMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: userMessageText,
      timestamp
    };
    addSlackMessage(userMsg);
    setBotIsTyping(true);

    // If new hire persona, supply role context
    const roleContext = userPersona === 'New Hire' ? onboardingRole : undefined;

    try {
      const response = await slackAI(userMessageText, roleContext);
      
      // Add bot message
      const botMsg: SlackMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: response.text.replace(/\{([^}]+)\}/g, '$1'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachments: response.attachments
      };
      addSlackMessage(botMsg);
    } catch (e) {
      console.error(e);
      addSlackMessage({
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: "Error connecting to the DecisionMemory service.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setBotIsTyping(false);
    }
  };

  const handlePredefinedClick = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="space-y-6 animate-fade-in py-6 max-w-4xl mx-auto flex flex-col h-[600px]">
      {/* Header Info */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Slack Integration Simulator</h1>
        <p className="text-slate-400 text-sm">Query your team's collective context from where you already work daily.</p>
      </div>

      {/* Main Slack Window */}
      <div className="flex-grow bg-[#1A1D21] border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Slack Subheader Banner */}
        <div className="bg-[#121518] px-5 py-3 border-b border-slate-800 flex items-center gap-2 text-white text-sm font-bold">
          <span className="text-slate-500 font-normal">#</span>
          <span>decision-memory-bot</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-wider">App</span>
        </div>

        {/* Message Thread Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-5">
          {slackThread.map((msg) => (
            <div key={msg.id} className="flex gap-4 items-start select-text group animate-fade-in">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm select-none ${
                msg.sender === 'user' ? 'bg-indigo-600' : 'bg-[#1E2A5E] border border-[#3B5BFF]'
              }`}>
                {msg.sender === 'user' ? <Laptop className="w-5 h-5" /> : <Brain className="w-5 h-5 text-electric" />}
              </div>

              {/* Message Details */}
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${msg.sender === 'user' ? 'text-slate-300' : 'text-[#3B5BFF]'}`}>
                    {msg.sender === 'user' ? 'Me' : 'DecisionMemory'}
                  </span>
                  {msg.sender === 'bot' && (
                    <span className="bg-slate-800 text-[8px] text-slate-400 px-1 py-0.2 rounded font-bold uppercase select-none">app</span>
                  )}
                  <span className="text-[10px] text-slate-500 font-semibold">{msg.timestamp}</span>
                </div>

                {/* Text Content */}
                <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Attachments rendering */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {msg.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="pl-3 border-l-4 rounded bg-slate-900/60 p-2.5 max-w-xl text-[11px] leading-relaxed shadow-sm"
                        style={{ borderColor: att.color || '#3B5BFF' }}
                      >
                        <div className="font-bold text-slate-400 mb-0.5">{att.title}</div>
                        <div className="text-slate-300 whitespace-pre-line">{att.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {botIsTyping && (
            <div className="flex gap-4 items-start select-none">
              <div className="w-9 h-9 rounded-lg bg-[#1E2A5E] flex items-center justify-center shrink-0 border border-[#3B5BFF]">
                <Brain className="w-5 h-5 text-electric animate-pulse" />
              </div>
              <div className="space-y-1 mt-1">
                <span className="text-xs font-bold text-[#3B5BFF]">DecisionMemory</span>
                <div className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-slate-800 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                  <span>typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Suggested tags to quick input */}
        <div className="px-5 py-2 border-t border-slate-800 bg-[#121518]/50 flex flex-wrap gap-2 text-[10px] text-slate-400 items-center">
          <span className="flex items-center gap-1 shrink-0 font-medium select-none">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Quick Suggestion:
          </span>
          <button
            onClick={() => handlePredefinedClick("@DecisionMemory why did we choose microservices?")}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            why did we choose microservices?
          </button>
          <button
            onClick={() => handlePredefinedClick("@DecisionMemory why did we drop dark mode?")}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            why did we drop dark mode?
          </button>
        </div>

        {/* Input Text Form */}
        <form onSubmit={handleSend} className="p-4 bg-[#121518] border-t border-slate-800 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to @DecisionMemory bot..."
            className="flex-grow bg-[#222529] border border-slate-700 text-xs px-4 py-3 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={botIsTyping || !inputText.trim()}
            className="px-4 rounded-lg bg-[#3B5BFF] hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow disabled:bg-slate-800 disabled:text-slate-600 shrink-0"
          >
            Send
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
