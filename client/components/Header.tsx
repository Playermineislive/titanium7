import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Model {
  id: string;
  name: string;
  category: string;
}

interface HeaderProps {
  activeModel: string;
  onModelChange: (model: string) => void;
}

const MODELS: Model[] = [
  // Language Models
  { id: "deepseek-r1", name: "DeepSeek R1", category: "Language Models" },
  { id: "qwen-3.5", name: "Qwen 3.5", category: "Language Models" },

  // Generative Art
  { id: "dreamshaper-xl", name: "DreamShaper XL", category: "Generative Art" },
  { id: "animagine-anime", name: "Animagine Anime", category: "Generative Art" },

  // Cinematic Video
  { id: "damo-t2v", name: "Damo T2V", category: "Cinematic Video" },
  { id: "stable-video", name: "Stable Video Diffusion", category: "Cinematic Video" },

  // Creative Editing
  { id: "instruct-pix2pix", name: "Instruct Pix2Pix", category: "Creative Editing" },
];

const CATEGORIES = [
  "Language Models",
  "Generative Art",
  "Cinematic Video",
  "Creative Editing",
];

export default function Header({ activeModel, onModelChange }: HeaderProps) {
  const [backendUrl, setBackendUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("titanium-backend-url");
    if (savedUrl) setBackendUrl(savedUrl);
  }, []);

  // Save to localStorage when values change
  const handleUrlChange = (value: string) => {
    setBackendUrl(value);
    localStorage.setItem("titanium-backend-url", value);
  };

  const handleModelChange = (value: string) => {
    onModelChange(value);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-blue-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl leading-none">T</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block tracking-tight">
              Titanium Studio
            </h1>
          </div>

          {/* Settings Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Model Selector */}
            <div className="hidden sm:block">
              <Select value={activeModel} onValueChange={handleModelChange}>
                <SelectTrigger className="glass-input w-48 md:w-56 px-4 py-2 text-sm border-0 bg-white/40 cursor-pointer">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border border-blue-100/30">
                  {CATEGORIES.map((category) => (
                    <SelectGroup key={category}>
                      <SelectLabel className="text-xs font-semibold text-slate-600 px-2 py-1.5 tracking-tight">
                        {category}
                      </SelectLabel>
                      {MODELS.filter((m) => m.category === category).map((model) => (
                        <SelectItem
                          key={model.id}
                          value={model.id}
                          className="cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="glass-button px-4 py-2 text-sm md:text-base rounded-full whitespace-nowrap"
              aria-label="Toggle settings"
            >
              {showUrlInput ? "✕" : "Settings"}
            </button>
          </div>
        </div>

        {/* URL Input Panel */}
        {showUrlInput && (
          <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Backend Ngrok URL:
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://your-ngrok-url.ngrok.io"
                className="glass-input flex-1 w-full text-sm"
              />
              <button
                onClick={() => setShowUrlInput(false)}
                className="glass-button px-6 py-2 text-sm rounded-full whitespace-nowrap w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
