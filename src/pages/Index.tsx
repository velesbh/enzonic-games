import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { useToast } from "@/hooks/use-toast";
import { UploadGameButton } from "@/components/UploadGameButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();

  const { data: featuredGames = [], isLoading } = useQuery({
    queryKey: ['featured-games'],
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

      // Process and sort games by likes
      const processedGames = data.map(game => ({
        ...game,
        likes: game.reactions?.filter(r => r.reaction_type === 'like').length || 0,
        dislikes: game.reactions?.filter(r => r.reaction_type === 'dislike').length || 0,
      }));

      return processedGames
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 4);
    },
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="container mx-auto pt-24">
        <div className="glass-panel mb-12 p-8 text-center">
          <h1 className="text-4xl font-bold neon-text md:text-6xl">
            Welcome to Enzonic Games
          </h1>
          <p className="mt-4 text-gray-400 md:text-lg">
            Experience the future of gaming with our collection of cyberpunk-themed games
          </p>
          <div className="mt-8">
            <UploadGameButton />
          </div>
        </div>

        {/* Featured Games */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-100">Featured Games</h2>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading featured games...</div>
          ) : featuredGames.length === 0 ? (
            <div className="text-center text-gray-400">No games available yet</div>
          ) : (
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
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="glass-panel mb-12 p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">Categories</h2>
          <div className="flex flex-wrap gap-4">
            {["Action", "Adventure", "Strategy", "RPG", "Puzzle"].map((category) => (
              <button
                key={category}
                className="rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;