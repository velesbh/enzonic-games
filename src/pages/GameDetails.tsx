import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-gray-400">Loading game details...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Game not found</h1>
          <Button onClick={() => navigate("/games")} className="mt-4">
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto pt-24">
        <button
          onClick={() => navigate("/games")}
          className="mb-6 flex items-center text-gray-400 hover:text-neon-emerald"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </button>

        <div className="glass-panel p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                src={game.thumbnail_url || '/placeholder.svg'}
                alt={game.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="mb-2 text-3xl font-bold neon-text">{game.title}</h1>
              <p className="mb-4 text-gray-400">{game.description}</p>
              
              {game.game_url && (
                <Button 
                  onClick={() => window.open(game.game_url, '_blank')}
                  className="w-full bg-neon-emerald text-black hover:bg-neon-emerald/90"
                >
                  Play Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;