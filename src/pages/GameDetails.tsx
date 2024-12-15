import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games } from "@/config/games";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const game = games.find((g) => g.id === id);

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

  const handleAction = () => {
    if (game.type === "play") {
      if (game.actionUrl.includes('scratch.mit.edu')) {
        // For Scratch games, we'll show them directly on the page
        return;
      }
      window.location.href = game.actionUrl;
    } else {
      toast({
        title: "Download started",
        description: "Your download will begin shortly...",
      });
      window.location.href = game.actionUrl;
    }
  };

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
              {game.actionUrl.includes('scratch.mit.edu') ? (
                <iframe
                  src={game.actionUrl}
                  allowTransparency={true}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  className="absolute inset-0"
                />
              ) : (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div>
              <h1 className="mb-2 text-3xl font-bold neon-text">{game.title}</h1>
              <p className="mb-4 text-gray-400">{game.description}</p>
              
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-400">Developer</span>
                  <span className="text-gray-200">{game.developer}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-400">Publisher</span>
                  <span className="text-gray-200">{game.publisher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Release Date</span>
                  <span className="text-gray-200">{game.releaseDate}</span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neon-emerald/10 px-3 py-1 text-sm text-neon-emerald"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {!game.actionUrl.includes('scratch.mit.edu') && (
                <Button
                  onClick={handleAction}
                  className="w-full bg-neon-emerald text-black hover:bg-neon-emerald/90"
                >
                  {game.type === "play" ? (
                    <Play className="mr-2 h-4 w-4" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {game.type === "play" ? "Play Now" : "Download"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-100">Reviews</h2>
            {game.reviews.length > 0 ? (
              <div className="space-y-4">
                {game.reviews.map((review) => (
                  <div key={review.id} className="rounded-lg bg-black/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-gray-200">
                        {review.author}
                      </span>
                      <span className="text-neon-emerald">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-400">{review.content}</p>
                    <span className="mt-2 block text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No reviews yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;