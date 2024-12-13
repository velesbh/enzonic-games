import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { useToast } from "@/hooks/use-toast";

const FEATURED_GAMES = [
  {
    id: 1,
    title: "Cyber Runner",
    description: "Fast-paced cyberpunk racing game",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Neon Fighters",
    description: "Competitive fighting in a neon world",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Digital Dreams",
    description: "Explore a virtual reality landscape",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Tech Wars",
    description: "Strategic battles in cyberspace",
    imageUrl: "/placeholder.svg",
  },
];

const Index = () => {
  const { toast } = useToast();

  const handlePlayGame = (gameTitle: string) => {
    toast({
      title: "Starting game...",
      description: `Launching ${gameTitle}`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto pt-24">
        <div className="glass-panel mb-12 p-8 text-center">
          <h1 className="text-4xl font-bold neon-text md:text-6xl">
            Welcome to Enzonic Games
          </h1>
          <p className="mt-4 text-gray-400 md:text-lg">
            Experience the future of gaming with our collection of cyberpunk-themed games
          </p>
        </div>

        {/* Featured Games */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-100">Featured Games</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURED_GAMES.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                onPlay={() => handlePlayGame(game.title)}
              />
            ))}
          </div>
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