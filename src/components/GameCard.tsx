import { Play } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onPlay: () => void;
}

export const GameCard = ({ title, description, imageUrl, onPlay }: GameCardProps) => {
  return (
    <div className="game-card group">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Play className="h-12 w-12 text-neon-emerald animate-glow" />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};