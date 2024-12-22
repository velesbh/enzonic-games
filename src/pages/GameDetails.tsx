import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { ArrowLeft, Download, Play } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
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
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto pt-24">
          <div className="text-center">Game not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto pt-24">
        <button
          onClick={() => navigate('/games')}
          className="mb-6 flex items-center text-gray-400 hover:text-neon-emerald"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={game.thumbnail_url || '/placeholder.svg'}
              alt={game.title}
              className="w-full rounded-lg object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-100">{game.title}</h1>
              <p className="mt-2 text-gray-400">
                By {game.profiles.username || 'Anonymous'}
              </p>
            </div>

            <p className="text-gray-300">{game.description}</p>

            <div className="flex gap-4">
              {game.game_type === 'download' ? (
                <Button asChild>
                  <a href={game.game_url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Game
                  </a>
                </Button>
              ) : (
                <Button onClick={() => window.open(game.game_url, '_blank')}>
                  <Play className="mr-2 h-4 w-4" />
                  Play Game
                </Button>
              )}

              {session?.user?.id === game.user_id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/games/${id}/edit`)}
                >
                  Edit Game
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CommentSection gameId={id!} />
        </div>
      </main>
    </div>
  );
};

export default GameDetails;