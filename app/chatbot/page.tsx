// app/chatbot/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AI_BOT_RESPONSES } from "@/data/mock";
import { processAIQuery, cn } from "@/lib/utils";
import type { ChatBotMessage } from "@/types";

const QUICK_PROMPTS = [
  "Which students are at risk?",
  "Summarize class performance",
  "Why is Arjun's grade dropping?",
  "Draft a message for Vikram's parents",
  "What's Neha's improvement trend?",
  "Homework completion stats",
];

const STUDENT_CONTEXT = `
You are an AI teaching assistant for EduAI School Platform. You have access to the following student data:

STUDENTS:
1. Riya Mehta (8A) - Attendance: 92%, Avg Score: 82%, Status: Good, Risk: 15%
   Subjects: Math 78, Science 88, English 85, SST 72, Hindi 91
   
2. Arjun Kumar (8A) - Attendance: 74%, Avg Score: 61%, Status: At-Risk, Risk: 62%
   Subjects: Math 52 (declining), Science 65, English 70, SST 68, Hindi 58
   Homework completion: 52%

3. Priya Sharma (8B) - Attendance: 88%, Avg Score: 75%, Status: Good, Risk: 22%

4. Vikram Singh (8B) - Attendance: 61%, Avg Score: 48%, Status: Critical, Risk: 85%
   Has missed 6 consecutive classes. 14 overdue assignments.
   
5. Neha Patel (8C) - Attendance: 95%, Avg Score: 91%, Status: Excellent, Risk: 5%
   Improved 12% in Science this term.

6. Dev Agarwal (8C) - Attendance: 80%, Avg Score: 69%, Status: Average, Risk: 38%

CLASS STATS: Avg score 74.2%, Attendance 87%, 7 at-risk students

Respond helpfully and concisely. Use markdown-style **bold** for emphasis. Keep responses under 200 words unless drafting a full letter.
`;

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatBotMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI teaching assistant powered by Claude. I can analyze student data and answer questions about attendance, grades, homework, and more.\n\nTry asking me about specific students, class performance, or get draft messages for parents.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || loading) return;

    const userMsg: ChatBotMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (useApi) {
      // Real Claude API call
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: STUDENT_CONTEXT,
            messages: [
              ...messages.filter(m => m.id !== "welcome").map(m => ({
                role: m.role,
                content: m.content,
              })),
              { role: "user", content: query },
            ],
          }),
        });
        const data = await response.json();
        const replyText = data.content?.[0]?.text || "I couldn't process that request.";

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      } catch {
        // Fallback to mock
        const key = processAIQuery(query);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: AI_BOT_RESPONSES[key] || AI_BOT_RESPONSES.default,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      }
    } else {
      // Mock responses with simulated delay
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      const key = processAIQuery(query);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: AI_BOT_RESPONSES[key] || AI_BOT_RESPONSES.default,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }

    setLoading(false);
  };

  const clear = () => setMessages([{
    id: "welcome",
    role: "assistant",
    content: "Chat cleared. How can I help you?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);

  return (
    <DashboardLayout title="AI Assistant">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              AI Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ask anything about student performance, attendance, or get recommendations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5 border border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500">Live API</span>
              <button
                onClick={() => setUseApi(!useApi)}
                className={cn("w-8 h-4 rounded-full transition-colors relative", useApi ? "bg-primary" : "bg-gray-300 dark:bg-gray-600")}
              >
                <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform", useApi ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
            <button onClick={clear} className="btn-outline text-xs flex items-center gap-1.5 py-2">
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">Quick questions</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-primary-light dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="card-base overflow-hidden flex flex-col" style={{ height: "calc(100vh - 380px)", minHeight: 360 }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.2) }}
                className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={cn("max-w-[80%]")}>
                  <div className={cn(
                    "px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user" ? "chat-me" : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700"
                  )}>
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                          part.startsWith("**") && part.endsWith("**")
                            ? <strong key={k}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className={cn("flex items-center gap-2 mt-1.5", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <div className="flex gap-1">
                        <button className="text-gray-300 hover:text-gray-500 transition-colors"><Copy className="w-3 h-3" /></button>
                        <button className="text-gray-300 hover:text-emerald-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                        <button className="text-gray-300 hover:text-red-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700 px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2.5 items-center bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-2.5 border border-gray-200 dark:border-gray-700 focus-within:border-primary transition-colors">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about student performance, attendance, recommendations..."
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  input.trim() && !loading ? "bg-primary text-white hover:bg-primary-hover active:scale-95" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                )}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {useApi ? "Connected to Claude API · Analyzing real student data" : "Demo mode — toggle Live API for real Claude responses"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
