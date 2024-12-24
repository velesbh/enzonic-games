import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";

const GameEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      
      const { data: game, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch game details",
          variant: "destructive",
        });
        navigate('/games');
        return;
      }

      if (game.user_id !== session?.user?.id) {
        toast({
          title: "Unauthorized",
          description: "You can only edit your own games",
          variant: "destructive",
        });
        navigate('/games');
        return;
      }

      setTitle(game.title);
      setDescription(game.description || "");
      setThumbnailUrl(game.thumbnail_url || "");
      setIsLoading(false);
    };

    fetchGame();
  }, [id, session]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      let newThumbnailUrl = thumbnailUrl;

      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const filePath = `${id}/thumbnail.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('game-files')
          .upload(filePath, thumbnail, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('game-files')
          .getPublicUrl(filePath);

        newThumbnailUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('games')
        .update({
          title,
          description,
          thumbnail_url: newThumbnailUrl,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      
      navigate(`/games/${id}`);
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete all related data in the correct order
      // First, delete comments
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('game_id', id);

      if (commentsError) throw commentsError;

      // Then, delete reactions
      const { error: reactionsError } = await supabase
        .from('game_reactions')
        .delete()
        .eq('game_id', id);

      if (reactionsError) throw reactionsError;

      // Then, delete favorites
      const { error: favoritesError } = await supabase
        .from('game_favorites')
        .delete()
        .eq('game_id', id);

      if (favoritesError) throw favoritesError;

      // Finally, delete the game itself
      const { error: gameError } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (gameError) throw gameError;

      // Clean up storage if there are any files
      if (thumbnailUrl) {
        const filePath = thumbnailUrl.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('game-files')
            .remove([`${id}/${filePath}`]);
        }
      }

      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
      
      navigate('/games');
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto pt-24">
        <button
          onClick={() => navigate(`/games/${id}`)}
          className="mb-6 flex items-center text-gray-400 hover:text-neon-emerald"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Game
        </button>

        <div className="glass-panel p-6">
          <h1 className="mb-6 text-2xl font-bold neon-text">Edit Game</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Thumbnail</label>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Current thumbnail"
                  className="mb-2 h-32 w-32 rounded object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="mb-2"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Update Game
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Game
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default GameEdit;