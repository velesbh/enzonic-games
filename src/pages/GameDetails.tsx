import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { CommentSection } from "@/components/CommentSection";

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      if (!id) throw new Error('No game ID provided');
      
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          reactions:game_reactions(reaction_type, user_id),
          favorites:game_favorites(user_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto pt-24">
          <p className="text-center text-gray-400">Loading game details...</p>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto pt-24">
          <p className="text-center text-gray-400">Game not found</p>
        </main>
      </div>
    );
  }

  const likes = game.reactions?.filter(r => r.reaction_type === 'like').length || 0;
  const dislikes = game.reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto pt-24 space-y-8">
        <div className="max-w-4xl mx-auto">
          <GameCard
            id={game.id}
            title={game.title}
            description={game.description || ''}
            imageUrl={game.thumbnail_url || '/placeholder.svg'}
            onPlay={() => {}}
            initialLikes={likes}
            initialDislikes={dislikes}
            initialIsFavorited={game.favorites?.length > 0}
          />
          
          <div className="mt-12">
            <CommentSection gameId={game.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;