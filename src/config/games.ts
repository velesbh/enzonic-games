import { Game } from "@/types/game";

export const games: Game[] = [
  {
    id: "cyber-runner",
    title: "Cyber Runner",
    description: "Fast-paced cyberpunk racing game where you navigate through neon-lit streets.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    type: "play",
    actionUrl: "https://example.com/cyber-runner",
    reviews: [
      {
        id: "1",
        author: "CyberGamer",
        rating: 4.5,
        content: "Amazing graphics and smooth gameplay!",
        date: "2024-01-15",
      },
    ],
    releaseDate: "2024-01-01",
    developer: "Enzonic Studios",
    publisher: "Enzonic Games",
    tags: ["Racing", "Cyberpunk", "Action"],
  },
  {
    id: "neon-fighters",
    title: "Neon Fighters",
    description: "Competitive fighting game set in a neon-drenched future.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    type: "download",
    actionUrl: "https://example.com/download/neon-fighters",
    reviews: [],
    releaseDate: "2024-02-01",
    developer: "Enzonic Studios",
    publisher: "Enzonic Games",
    tags: ["Fighting", "Multiplayer", "Arcade"],
  },
];