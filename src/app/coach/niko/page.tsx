"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/lib/stores/toast-store";
import { Send, Bot, User, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AGE_GROUPS = [
  "General",
  "U6",
  "U8",
  "U10",
  "U12",
  "U14",
  "U16",
] as const;

const SUGGESTION_CHIPS = [
  "Suggest a passing drill for U10",
  "How do I coach defending to beginners?",
  "Create a 60-min session for U14",
  "Tips for coaching in hot weather",
];

// ---------------------------------------------------------------------------
// Markdown-like renderer
// ---------------------------------------------------------------------------

function renderMessageContent(content: string): React.ReactNode {
  const paragraphs = content.split(/\n{2,}/);

  return paragraphs.map((block, pIdx) => {
    const lines = block.split("\n");

    // Detect if the entire block is a bullet list
    const isBulletList = lines.every(
      (l) => l.trim().startsWith("- ") || l.trim() === ""
    );
    // Detect if the entire block is a numbered list
    const isNumberedList = lines.every(
      (l) => /^\d+\.\s/.test(l.trim()) || l.trim() === ""
    );

    if (isBulletList) {
      return (
        <ul key={pIdx} className="list-disc list-inside space-y-1 my-2">
          {lines
            .filter((l) => l.trim().startsWith("- "))
            .map((l, i) => (
              <li key={i}>{renderInline(l.trim().slice(2))}</li>
            ))}
        </ul>
      );
    }

    if (isNumberedList) {
      return (
        <ol key={pIdx} className="list-decimal list-inside space-y-1 my-2">
          {lines
            .filter((l) => /^\d+\.\s/.test(l.trim()))
            .map((l, i) => (
              <li key={i}>
                {renderInline(l.trim().replace(/^\d+\.\s/, ""))}
              </li>
            ))}
        </ol>
      );
    }

    // Regular paragraph — render each line, preserving single newlines
    return (
      <p key={pIdx} className="my-1.5 leading-relaxed">
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

/** Render inline formatting: **bold** */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome screen
// ---------------------------------------------------------------------------

function WelcomeScreen({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Avatar */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0B2545] to-[#1D4ED8] shadow-lg">
        <Bot className="h-10 w-10 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        G&apos;day! I&apos;m Coach Niko
      </h2>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-gray-500">
        I&apos;m your AI coaching assistant, trained on the FFA National
        Curriculum and your club&apos;s coaching resources. Ask me anything
        about training, drills, player development, or match preparation.
      </p>

      {/* Suggestion chips */}
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSuggestionClick(chip)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-all hover:border-[#1D4ED8]/40 hover:bg-[#1D4ED8]/5 hover:text-[#1D4ED8] active:scale-[0.97]"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function CoachNikoPage() {
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ageGroup, setAgeGroup] = useState("General");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // -----------------------------------------------------------------------
  // Send message
  // -----------------------------------------------------------------------

  async function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/coach-niko/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          ageGroup: ageGroup !== "General" ? ageGroup : undefined,
          conversationHistory: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          data.message ??
          data.reply ??
          data.response ??
          "Sorry, I didn't get a response. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      addToast(
        "Failed to get a response from Coach Niko. Please try again.",
        "error"
      );
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ----------------------------------------------------------------- */}
      {/* Left sidebar strip                                                 */}
      {/* ----------------------------------------------------------------- */}
      <aside className="hidden w-16 shrink-0 flex-col items-center bg-[#0B2545] py-5 md:flex">
        {/* Back button */}
        <Link
          href="/coach"
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Back to Coach Portal"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Coach Niko avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6]">
          <Bot className="h-5 w-5 text-white" />
        </div>

        {/* Vertical label */}
        <span
          className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-white/50"
          style={{ writingMode: "vertical-rl" }}
        >
          Coach Niko
        </span>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* Main chat area                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left — title */}
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <Link
                href="/coach"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
                aria-label="Back to Coach Portal"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900">
                    Coach Niko
                  </h1>
                  <Sparkles className="h-4 w-4 text-[#1D4ED8]" />
                </div>
                <p className="hidden text-xs text-gray-400 sm:block">
                  AI Coaching Assistant — Nickol Soccer Club
                </p>
              </div>
            </div>

            {/* Right — age group selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="age-group"
                className="hidden text-xs font-medium text-gray-500 sm:block"
              >
                Context:
              </label>
              <select
                id="age-group"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
              >
                {AGE_GROUPS.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {messages.length === 0 && !isTyping ? (
            <WelcomeScreen onSuggestionClick={(text) => handleSend(text)} />
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "mb-4 flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Assistant avatar */}
                  {msg.role === "assistant" && (
                    <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-[#1D4ED8] text-white"
                        : "rounded-tl-sm bg-gray-100 text-gray-800"
                    )}
                  >
                    {msg.role === "assistant"
                      ? renderMessageContent(msg.content)
                      : msg.content}
                  </div>

                  {/* User avatar */}
                  {msg.role === "user" && (
                    <div className="ml-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-white">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <footer className="shrink-0 border-t border-gray-200 bg-white px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Coach Niko anything..."
              disabled={isTyping}
              className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-[#1D4ED8]/40 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/20 disabled:opacity-60"
            />
            <Button
              variant="accent"
              size="lg"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 shrink-0 rounded-full p-0"
              aria-label="Send message"
            >
              {isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Powered by Coach Niko AI
          </p>
        </footer>
      </div>
    </div>
  );
}
