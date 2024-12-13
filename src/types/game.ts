export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "download" | "play";
  actionUrl: string;
  reviews: Review[];
  releaseDate: string;
  developer: string;
  publisher: string;
  tags: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}