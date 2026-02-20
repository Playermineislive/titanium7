import { Copy, Download, Trash2 } from "lucide-react";
import { useState } from "react";

interface GenerationCardProps {
  id: string;
  prompt: string;
  model: string;
  result?: string | null;
  resultType?: "text" | "image" | "video";
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

const MODEL_LABELS: Record<string, { label: string; color: string }> = {
  "deepseek-r1": { label: "DeepSeek R1", color: "bg-purple-100 text-purple-700" },
  "qwen-3.5": { label: "Qwen 3.5", color: "bg-cyan-100 text-cyan-700" },
  "dreamshaper-xl": { label: "DreamShaper XL", color: "bg-pink-100 text-pink-700" },
  "animagine-anime": { label: "Animagine Anime", color: "bg-rose-100 text-rose-700" },
  "damo-t2v": { label: "Damo T2V", color: "bg-orange-100 text-orange-700" },
  "stable-video": { label: "Stable Video", color: "bg-amber-100 text-amber-700" },
  "instruct-pix2pix": { label: "Instruct Pix2Pix", color: "bg-indigo-100 text-indigo-700" },
};

export default function GenerationCard({
  id,
  prompt,
  model,
  result,
  resultType = "text",
  isLoading = false,
  onDelete,
}: GenerationCardProps) {
  const [copied, setCopied] = useState(false);
  const modelInfo = MODEL_LABELS[model] || { label: model, color: "bg-blue-100 text-blue-700" };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const element = document.createElement("a");
    
    if (resultType === "text") {
      const file = new Blob([result], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `generation-${id}.txt`;
    } else {
      element.href = result;
      element.download = `generation-${id}${resultType === "image" ? ".png" : ".mp4"}`;
    }
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="generation-card group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${modelInfo.color}`}>
            {modelInfo.label}
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">{prompt}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {result && (
            <>
              <button
                onClick={handleCopy}
                className="glass-button p-2 rounded-full text-white hover:scale-110"
                title={copied ? "Copied!" : "Copy"}
              >
                <Copy className="w-4 h-4" />
              </button>
              {resultType === "text" && (
                <button
                  onClick={handleDownload}
                  className="glass-button p-2 rounded-full text-white hover:scale-110"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="glass-button p-2 rounded-full text-white hover:scale-110 hover:bg-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Result Area */}
      <div className="min-h-32 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border border-blue-100/30">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full" />
              </div>
              <p className="text-sm text-slate-500">Generating...</p>
            </div>
          </div>
        ) : result ? (
          <>
            {resultType === "text" && (
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {result}
                </p>
              </div>
            )}
            
            {resultType === "image" && (
              <img
                src={result}
                alt="Generated"
                className="w-full h-auto rounded-xl object-cover max-h-96"
              />
            )}
            
            {resultType === "video" && (
              <video
                src={result}
                controls
                className="w-full h-auto rounded-xl object-cover max-h-96"
              />
            )}
          </>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
            Waiting for results...
          </div>
        )}
      </div>
    </div>
  );
}
