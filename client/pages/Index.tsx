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

export default function Index() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedModel, setSelectedModel] = useState("deepseek-r1");
  const containerRef = useRef<HTMLDivElement>(null);

  // Load selected model from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("titanium-selected-model");
    if (saved) setSelectedModel(saved);

    // Also listen for changes from Header
    const handleStorageChange = () => {
      const updated = localStorage.getItem("titanium-selected-model");
      if (updated) setSelectedModel(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSend = async (prompt: string, file?: File) => {
    const backendUrl = localStorage.getItem("titanium-backend-url") || "";
    const currentModel = localStorage.getItem("titanium-selected-model") || selectedModel;

    const id = Date.now().toString();
    const newGeneration: Generation = {
      id,
      prompt,
      model: currentModel,
      result: null,
      resultType: "text",
      isLoading: true,
      timestamp: Date.now(),
    };

    setGenerations((prev) => [newGeneration, ...prev]);

    // Scroll to new card
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      // Simulate API call - replace with actual backend call
      // For now, show a demo result
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGenerations((prev) =>
        prev.map((gen) =>
          gen.id === id
            ? {
                ...gen,
                isLoading: false,
                result: `Generated content for: "${prompt}"\n\nThis is a demo response. Connect your backend URL in settings to get real results from ${currentModel}.`,
                resultType: "text",
              }
            : gen
        )
      );
    } catch (error) {
      console.error("Error generating:", error);
      setGenerations((prev) =>
        prev.map((gen) =>
          gen.id === id
            ? {
                ...gen,
                isLoading: false,
                result: "Error generating content. Please check your backend URL and try again.",
              }
            : gen
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    setGenerations((prev) => prev.filter((gen) => gen.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        {generations.length === 0 ? (
          // Empty State - Perfectly Centered
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
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
        ) : (
          // Generation Cards Grid
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32 auto-rows-max"
          >
            {generations.map((gen) => (
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
        )}
      </main>

      {/* Floating Input Dock */}
      <FloatingInputDock onSend={handleSend} />
    </div>
  );
}
