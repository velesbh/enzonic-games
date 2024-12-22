import { Heart, ThumbsDown, ThumbsUp, Play } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onPlay: () => void;
  initialLikes?: number;
  initialDislikes?: number;
  initialUserReaction?: 'like' | 'dislike' | null;
}

export const GameCard = ({ 
  id,
  title, 
  description, 
  imageUrl, 
  onPlay,
  initialLikes = 0,
  initialDislikes = 0,
  initialUserReaction = null
}: GameCardProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(initialUserReaction);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to react to games",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userReaction === type) {
        // Remove reaction
        await supabase
          .from('game_reactions')
          .delete()
          .eq('user_id', session.user.id)
          .eq('game_id', id);
        
        setUserReaction(null);
        if (type === 'like') setLikes(prev => prev - 1);
        else setDislikes(prev => prev - 1);
      } else {
        // If there was a previous reaction, remove it first
        if (userReaction) {
          if (userReaction === 'like') setLikes(prev => prev - 1);
          else setDislikes(prev => prev - 1);
        }

        // Add new reaction
        await supabase
          .from('game_reactions')
          .upsert({
            user_id: session.user.id,
            game_id: id,
            reaction_type: type,
          });

        setUserReaction(type);
        if (type === 'like') setLikes(prev => prev + 1);
        else setDislikes(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      });
    }
  };

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
        <div className="mt-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('like')}
            className={userReaction === 'like' ? 'text-green-500' : ''}
          >
            <ThumbsUp className="mr-1 h-4 w-4" />
            {likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('dislike')}
            className={userReaction === 'dislike' ? 'text-red-500' : ''}
          >
            <ThumbsDown className="mr-1 h-4 w-4" />
            {dislikes}
          </Button>
        </div>
      </div>
    </div>
  );
};