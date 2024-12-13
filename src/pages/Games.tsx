import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/GameCard";
import { games } from "@/config/games";
import { Header } from "@/components/Header";

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto pt-24">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold neon-text">Games</h1>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <GameCard
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                onPlay={() => {}}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Games;