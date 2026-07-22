import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  HeartPulse,
  LoaderCircle,
  MessageCircleMore,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UserRound,
  WifiOff,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  clearPatientChatHistory,
  sendPatientChatMessage,
} from "@/services/patientApi";

const HOKU_PRIMARY = "#1E63C6";
const HOKU_PRIMARY_DARK = "#174FA0";

const suggestedQuestions = [
  "How can I prepare for a doctor appointment?",
  "What information should I track about my symptoms?",
  "How can I remember to take my medicine?",
  "When should I seek urgent medical care?",
];

const emergencyKeywords = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "severe bleeding",
  "unconscious",
  "passed out",
  "seizure",
  "stroke",
  "suicide",
  "kill myself",
];

function createInitialMessages() {
  return [
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Hello! I’m the HOKU AI Health Assistant. I can provide general health information, help you prepare for appointments, and guide you through HOKU patient services.",
      time: "Now",
    },
    {
      id: "disclaimer-message",
      role: "assistant",
      type: "notice",
      content:
        "I cannot diagnose medical conditions or replace a qualified healthcare professional. For urgent or severe symptoms, contact emergency services immediately.",
      time: "Now",
    },
  ];
}

function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function formatCurrentTime() {
  return new Intl.DateTimeFormat(
    "en-PK",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  ).format(new Date());
}

function containsEmergencyKeywords(
  value
) {
  const normalizedValue = value
    .trim()
    .toLowerCase();

  return emergencyKeywords.some(
    (keyword) =>
      normalizedValue.includes(keyword)
  );
}

function getErrorMessage(
  error,
  fallback = "Unable to send your message."
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function normalizeAssistantResponse(
  payload
) {
  const root =
    payload?.response ||
    payload?.result ||
    payload?.chat ||
    payload?.data?.response ||
    payload?.data?.result ||
    payload?.data?.chat ||
    payload?.data ||
    payload ||
    {};

  const content =
    typeof root === "string"
      ? root
      : root?.message ||
        root?.reply ||
        root?.response ||
        root?.answer ||
        root?.content ||
        root?.text ||
        root?.assistant_message ||
        root?.assistantMessage ||
        "";

  const conversationId =
    root?.conversation_id ||
    root?.conversationId ||
    root?.session_id ||
    root?.sessionId ||
    null;

  return {
    content:
      String(content).trim() ||
      "I’m unable to provide a response right now. Please try again or consult a qualified healthcare professional.",

    conversationId,
  };
}

function createConversationPayload(
  messages
) {
  return messages
    .filter(
      (message) =>
        message.type !== "notice" &&
        message.type !== "emergency" &&
        [
          "patient",
          "assistant",
        ].includes(message.role)
    )
    .map((message) => ({
      role:
        message.role === "patient"
          ? "user"
          : "assistant",

      content: message.content,
    }));
}

function ChatMessage({ message }) {
  const isPatient =
    message.role === "patient";

  if (message.type === "notice") {
    return (
      <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em]">
            Medical disclaimer
          </p>

          <p className="mt-1 text-xs leading-6">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  if (message.type === "error") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
        <WifiOff className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-bold">
            Assistant unavailable
          </p>

          <p className="mt-1 text-sm leading-6">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  if (message.type === "emergency") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-bold">
            Urgent warning
          </p>

          <p className="mt-1 text-sm leading-6">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 ${
        isPatient
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isPatient && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isPatient
            ? "items-end"
            : "items-start"
        }`}
      >
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
            isPatient
              ? "rounded-br-md bg-[#1E63C6] text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
          }`}
        >
          {message.content}
        </div>

        <p
          className={`mt-1.5 text-[10px] text-slate-400 ${
            isPatient
              ? "text-right"
              : "text-left"
          }`}
        >
          {isPatient
            ? "You"
            : "HOKU AI"}{" "}
          · {message.time}
        </p>
      </div>

      {isPatient && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
        <Bot className="h-4 w-4" />
      </div>

      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
              style={{
                animationDelay: `${item * 120}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIChatbot() {
  const [messages, setMessages] =
    useState(() =>
      createInitialMessages()
    );

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [
    clearingChat,
    setClearingChat,
  ] = useState(false);

  const [
    conversationId,
    setConversationId,
  ] = useState(null);

  const [chatError, setChatError] =
    useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  const sendMessage = async (
    messageText
  ) => {
    const trimmedMessage =
      messageText.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    const patientMessage = {
      id: createMessageId(),
      role: "patient",
      content: trimmedMessage,
      time: formatCurrentTime(),
    };

    const conversationBeforeMessage =
      createConversationPayload(
        messages
      );

    setMessages(
      (currentMessages) => [
        ...currentMessages,
        patientMessage,
      ]
    );

    setMessage("");
    setChatError("");

    const emergencyDetected =
      containsEmergencyKeywords(
        trimmedMessage
      );

    if (emergencyDetected) {
      const emergencyMessage = {
        id: createMessageId(),
        role: "assistant",
        type: "emergency",
        content:
          "Your message may describe a medical emergency. Contact your local emergency service or go to the nearest emergency department immediately. Do not wait for an online response.",
        time: formatCurrentTime(),
      };

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          emergencyMessage,
        ]
      );

      toast.error(
        "Possible emergency detected. Seek urgent medical assistance."
      );

      return;
    }

    try {
      setSending(true);

      const payload = {
        message: trimmedMessage,

        conversation: [
          ...conversationBeforeMessage,
          {
            role: "user",
            content: trimmedMessage,
          },
        ],

        conversation_id:
          conversationId,
      };

      const response =
        await sendPatientChatMessage(
          payload
        );

      const normalizedResponse =
        normalizeAssistantResponse(
          response
        );

      if (
        normalizedResponse.conversationId
      ) {
        setConversationId(
          normalizedResponse.conversationId
        );
      }

      const assistantMessage = {
        id: createMessageId(),
        role: "assistant",
        type: "message",
        content:
          normalizedResponse.content,
        time: formatCurrentTime(),
      };

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]
      );
    } catch (error) {
      console.error(
        "AI chatbot error:",
        error
      );

      const errorMessage =
        getErrorMessage(error);

      setChatError(errorMessage);

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          {
            id: createMessageId(),
            role: "assistant",
            type: "error",
            content:
              "The AI health assistant could not respond. Please check the server connection and try again.",
            time: formatCurrentTime(),
          },
        ]
      );

      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    sendMessage(message);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage(message);
    }
  };

  const clearConversation = async () => {
    const shouldClear =
      window.confirm(
        "Clear this AI chat conversation?"
      );

    if (!shouldClear) {
      return;
    }

    try {
      setClearingChat(true);

      try {
        await clearPatientChatHistory();
      } catch (apiError) {
        console.warn(
          "Server chat history could not be cleared:",
          apiError
        );
      }

      setMessages(
        createInitialMessages()
      );

      setMessage("");
      setConversationId(null);
      setChatError("");

      toast.success(
        "Chat conversation cleared."
      );
    } finally {
      setClearingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <MessageCircleMore className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                AI health assistant
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                HOKU AI Chatbot
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Ask general health questions
                and receive guidance about
                HOKU patient services.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={clearConversation}
              disabled={
                clearingChat || sending
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearingChat ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}

              {clearingChat
                ? "Clearing..."
                : "Clear Chat"}
            </button>

            <Link
              to="/patient/book-appointment"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0]"
            >
              <CalendarPlus className="h-4 w-4" />

              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency notice */}
      <section className="flex items-start gap-3 rounded-[20px] border border-red-200 bg-red-50 px-4 py-4 text-red-700 sm:px-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-bold">
            Do not use this chatbot during
            an emergency
          </p>

          <p className="mt-1 text-xs leading-6">
            For severe breathing
            difficulty, chest pain,
            unconsciousness, seizure,
            severe bleeding, or immediate
            danger, contact emergency
            services now.
          </p>
        </div>
      </section>

      {chatError && (
        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-5">
            {chatError}
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        {/* Chat area */}
        <section className="flex min-h-[650px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          {/* Chat header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E63C6] text-white">
                <Bot className="h-5 w-5" />

                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  HOKU AI Assistant
                </h2>

                <p className="mt-0.5 text-xs text-emerald-600">
                  Online · General guidance
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-[#B7CF35]/15 px-3 py-1.5 text-xs font-semibold text-[#61720E] sm:flex">
              <Sparkles className="h-3.5 w-3.5" />

              AI-powered
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-6">
            {messages.map(
              (chatMessage) => (
                <ChatMessage
                  key={chatMessage.id}
                  message={chatMessage}
                />
              )
            )}

            {sending && (
              <TypingIndicator />
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-3"
            >
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="chat-message"
                  className="sr-only"
                >
                  Type your health question
                </label>

                <textarea
                  id="chat-message"
                  value={message}
                  onChange={(event) => {
                    setMessage(
                      event.target.value
                    );

                    if (chatError) {
                      setChatError("");
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                  rows={1}
                  maxLength={1000}
                  placeholder="Ask a general health question..."
                  className="max-h-36 min-h-12 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-slate-400">
                    Press Enter to send,
                    Shift + Enter for a new
                    line.
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {message.length}/1000
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
                style={{
                  backgroundColor:
                    sending
                      ? HOKU_PRIMARY_DARK
                      : HOKU_PRIMARY,
                }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#1E63C6]/20 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                {sending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Suggested Questions
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose a question to start
                  the conversation.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B7CF35]/20 text-[#61720E]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {suggestedQuestions.map(
                (question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() =>
                      sendMessage(question)
                    }
                    disabled={sending}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                )
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              HOKU Patient Tools
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Access related healthcare
              services.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                to="/patient/symptom-checker"
                className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Symptom Checker
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review symptoms and
                    general next steps.
                  </p>
                </div>
              </Link>

              <Link
                to="/patient/book-appointment"
                className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B7CF35]/20 text-[#61720E]">
                  <Stethoscope className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Book Appointment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Schedule care with a
                    healthcare professional.
                  </p>
                </div>
              </Link>
            </div>
          </section>

          <section className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <h2 className="text-sm font-bold text-emerald-800">
                  Protect Your Privacy
                </h2>

                <p className="mt-1 text-xs leading-6 text-emerald-700">
                  Do not share passwords,
                  banking information,
                  identity numbers, or other
                  highly sensitive personal
                  information in the chat.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            <p className="text-xs leading-5 text-slate-500">
              AI responses can be incorrect
              or incomplete. Always verify
              important health information
              with a qualified professional.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}