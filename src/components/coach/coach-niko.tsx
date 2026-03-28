"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m0",
    role: "bot",
    content:
      "G'day Coach! I'm Coach Niko, your AI assistant. Ask me about drills, tactics, training plans, or anything to help your team improve. How can I help today?",
    timestamp: "9:00 AM",
  },
  {
    id: "m1",
    role: "user",
    content: "What drills should I run for U9s working on passing?",
    timestamp: "9:01 AM",
  },
  {
    id: "m2",
    role: "bot",
    content: `Great question! Here's a structured passing session for Under 9s (approx. 45 min):

**Warm-Up (10 min)**
- Pairs passing: players stand 5m apart, pass and receive with inside of foot
- Progress to moving while passing (walking, then jogging)

**Drill 1 - Triangle Passing (10 min)**
- Groups of 3, set up in triangles (5m sides)
- Pass and follow your ball to the next cone
- Focus: weight of pass, body shape, first touch

**Drill 2 - Gates Game (10 min)**
- Set up small "gates" (pairs of cones 1m apart) around a grid
- Pairs must pass through as many gates as possible in 2 minutes
- Encourages scanning, communication, and accuracy

**Small-Sided Game (15 min)**
- 4v4 with a condition: must complete 3 passes before scoring
- Reinforces passing in a game situation

**Key Coaching Points:**
- Use the inside of the foot
- Look at your target before passing
- Cushion the ball on first touch
- Communicate ("here!", "turn!")

Would you like me to adjust this for your specific training slot or focus area?`,
    timestamp: "9:01 AM",
  },
];

export function CoachNiko() {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: `m${messages.length}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    const botMsg: Message = {
      id: `m${messages.length + 1}`,
      role: "bot",
      content:
        "Thanks for your question! In a full implementation, I'd provide a detailed, context-aware response here. For now, this is a placeholder. Ask me anything about training drills, match tactics, or player development!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");
  };

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gradient-to-r from-[#0B2545] to-[#1D4ED8] px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Ask Coach Niko</h3>
          <p className="text-xs text-white/70">AI Training Assistant</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                msg.role === "bot"
                  ? "bg-[#0B2545] text-white"
                  : "bg-[#1D4ED8] text-white"
              )}
            >
              {msg.role === "bot" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "bot"
                  ? "rounded-tl-sm bg-white border border-gray-200 text-gray-700 shadow-sm"
                  : "rounded-tr-sm bg-[#1D4ED8] text-white"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <p
                className={cn(
                  "mt-1.5 text-[10px]",
                  msg.role === "bot" ? "text-gray-400" : "text-white/60"
                )}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder="Ask Coach Niko a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-h-[44px]"
          />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="shrink-0 min-h-[44px] min-w-[44px] px-3"
            disabled={!inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
