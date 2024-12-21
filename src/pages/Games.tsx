import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/GameCard";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

type ReactionType = 'like' | 'dislike';

interface GameWithReactions {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  reactions: {
    reaction_type: string;
    user_id: string;
  }[];
  favorites: {
    user_id: string;
  }[];
  likes: number;
  dislikes: number;
  userReaction: ReactionType | null;
  isFavorited: boolean;
}

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          reactions:game_reactions(
            reaction_type,
            user_id
          ),
          favorites:game_favorites(
            user_id
          )
        `);
      
      if (error) throw error;

      return data.map((game): GameWithReactions => ({
        ...game,
        likes: game.reactions?.filter(r => r.reaction_type === 'like').length || 0,
        dislikes: game.reactions?.filter(r => r.reaction_type === 'dislike').length || 0,
        userReaction: game.reactions?.find(r => r.user_id === session?.user?.id)?.reaction_type as ReactionType | null || null,
        isFavorited: game.favorites?.some(f => f.user_id === session?.user?.id) || false,
      }));
    },
  });

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (game.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Sort games by likes for the featured section
  const featuredGames = [...games]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto pt-24">
        {featuredGames.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold neon-text">Featured Games</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredGames.map((game) => (
                <Link key={game.id} to={`/games/${game.id}`}>
                  <GameCard
                    id={game.id}
                    title={game.title}
                    description={game.description || ''}
                    imageUrl={game.thumbnail_url || '/placeholder.svg'}
                    onPlay={() => {}}
                    initialLikes={game.likes}
                    initialDislikes={game.dislikes}
                    initialIsFavorited={game.isFavorited}
                    initialUserReaction={game.userReaction}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold neon-text">All Games</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading games...</div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center text-gray-400">No games found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <Link key={game.id} to={`/games/${game.id}`}>
                <GameCard
                  id={game.id}
                  title={game.title}
                  description={game.description || ''}
                  imageUrl={game.thumbnail_url || '/placeholder.svg'}
                  onPlay={() => {}}
                  initialLikes={game.likes}
                  initialDislikes={game.dislikes}
                  initialIsFavorited={game.isFavorited}
                  initialUserReaction={game.userReaction}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;