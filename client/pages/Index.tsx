import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import GenerationCard from "@/components/GenerationCard";
import FloatingInputDock from "@/components/FloatingInputDock";

interface Generation {
  id: string;
  prompt: string;
  model: string;
  result?: string | null;
  resultType: "text" | "image" | "video";
  isLoading: boolean;
  timestamp: number;
}

const MODEL_IDS = [
  "deepseek-r1",
  "qwen-3.5",
  "dreamshaper-xl",
  "animagine-anime",
  "damo-t2v",
  "stable-video",
  "instruct-pix2pix",
];

export default function Index() {
  const [modelChats, setModelChats] = useState<Record<string, Generation[]>>(
    MODEL_IDS.reduce((acc, id) => ({ ...acc, [id]: [] }), {})
  );
  const [activeModel, setActiveModel] = useState("deepseek-r1");
  const [fadeOut, setFadeOut] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Load persisted state from localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem("titanium-selected-model");
    const savedChats = localStorage.getItem("titanium-model-chats");

    if (savedModel) setActiveModel(savedModel);
    if (savedChats) {
      try {
        setModelChats(JSON.parse(savedChats));
      } catch (e) {
        console.error("Failed to load saved chats:", e);
      }
    }
  }, []);

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("titanium-model-chats", JSON.stringify(modelChats));
  }, [modelChats]);

  // Auto-scroll to bottom when generations change
  useEffect(() => {
    if (shouldAutoScrollRef.current && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [modelChats[activeModel]]);

  // Handle model change with fade transition
  const handleModelChange = (newModel: string) => {
    if (newModel === activeModel) return;

    setFadeOut(true);
    setTimeout(() => {
      setActiveModel(newModel);
      localStorage.setItem("titanium-selected-model", newModel);
      setFadeOut(false);
    }, 150);
  };

  const handleSend = async (prompt: string, file?: File) => {
    const backendUrl = localStorage.getItem("titanium-backend-url") || "";

    const id = Date.now().toString();
    const newGeneration: Generation = {
      id,
      prompt,
      model: activeModel,
      result: null,
      resultType: "text",
      isLoading: true,
      timestamp: Date.now(),
    };

    // Add to active model's chat
    setModelChats((prev) => ({
      ...prev,
      [activeModel]: [newGeneration, ...prev[activeModel]],
    }));

    shouldAutoScrollRef.current = true;

    try {
      // Simulate API call - replace with actual backend call
      // For now, show a demo result
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setModelChats((prev) => ({
        ...prev,
        [activeModel]: prev[activeModel].map((gen) =>
          gen.id === id
            ? {
                ...gen,
                isLoading: false,
                result: `Generated content for: "${prompt}"\n\nThis is a demo response. Connect your backend URL in settings to get real results from ${activeModel}.`,
                resultType: "text",
              }
            : gen
        ),
      }));
    } catch (error) {
      console.error("Error generating:", error);
      setModelChats((prev) => ({
        ...prev,
        [activeModel]: prev[activeModel].map((gen) =>
          gen.id === id
            ? {
                ...gen,
                isLoading: false,
                result: "Error generating content. Please check your backend URL and try again.",
              }
            : gen
        ),
      }));
    }
  };

  const handleDelete = (id: string) => {
    setModelChats((prev) => ({
      ...prev,
      [activeModel]: prev[activeModel].filter((gen) => gen.id !== id),
    }));
  };

  const currentGenerations = modelChats[activeModel] || [];
  const hasGenerations = currentGenerations.length > 0;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col overflow-hidden">
      <Header activeModel={activeModel} onModelChange={handleModelChange} />

      {/* Main Chat Container - 100vh with proper scrolling */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Chat Feed or Empty State */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto transition-opacity duration-150 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {hasGenerations ? (
            // Generation Cards Grid with Auto-rows
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {currentGenerations.map((gen) => (
                  <GenerationCard
                    key={gen.id}
                    id={gen.id}
                    prompt={gen.prompt}
                    model={gen.model}
                    result={gen.result}
                    resultType={gen.resultType}
                    isLoading={gen.isLoading}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Empty State - Perfectly Centered
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
              <div className="mb-6 float-animation">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight">
                Welcome to Titanium Studio
              </h2>
              <p className="text-slate-600 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                Your premium AI generation platform. Create stunning content with our cutting-edge models.
              </p>
              <div className="glass-panel p-6 max-w-sm text-left">
                <h3 className="font-semibold text-slate-800 mb-4 text-base">Quick Start:</h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold leading-none">
                      1
                    </span>
                    <span className="leading-snug">Select an AI model from the header dropdown</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold leading-none">
                      2
                    </span>
                    <span className="leading-snug">Configure your Backend Ngrok URL in settings</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold leading-none">
                      3
                    </span>
                    <span className="leading-snug">Describe what you want to create in the dock</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold leading-none">
                      4
                    </span>
                    <span className="leading-snug">Watch your generation appear here</span>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Input Dock - Pinned at Bottom */}
      <FloatingInputDock onSend={handleSend} />
    </div>
  );
}
