import { useRef, useEffect, useState } from "react";
import { Paperclip, Send } from "lucide-react";

interface FloatingInputDockProps {
  onSend: (prompt: string, file?: File) => void;
  isLoading?: boolean;
}

export default function FloatingInputDock({
  onSend,
  isLoading = false,
}: FloatingInputDockProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  const handleSend = () => {
    if (prompt.trim()) {
      onSend(prompt, selectedFile || undefined);
      setPrompt("");
      setSelectedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto px-4 pb-6 md:pb-8 pointer-events-auto">
        <div className="glass-panel p-4 md:p-6 flex flex-col gap-4">
          {/* File Attachment Indicator */}
          {selectedFile && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/80 rounded-full text-sm text-slate-700 border border-blue-100/50 animate-in slide-in-from-top duration-200">
              <Paperclip className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="flex-1 truncate">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer transition-colors flex-shrink-0"
                aria-label="Remove attachment"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-end gap-2 md:gap-3">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*"
              aria-label="File upload"
            />

            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="glass-button rounded-full p-2.5 md:p-3 flex-shrink-0"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to create..."
              disabled={isLoading}
              className="glass-input flex-1 resize-none max-h-32 min-h-12 text-sm md:text-base"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              className="glass-button rounded-full p-2.5 md:p-3 flex-shrink-0"
              aria-label="Send prompt"
            >
              {isLoading ? (
                <Send className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center leading-snug">
            Powered by Titanium Studio
          </p>
        </div>
      </div>
    </div>
  );
}
