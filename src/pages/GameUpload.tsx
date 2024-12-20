import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GameUpload = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [gameFile, setGameFile] = useState<File | null>(null);

  if (!session) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gameFile) {
      toast({
        title: "No file selected",
        description: "Please select a game file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      // Upload game file to storage
      const fileExt = gameFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from("game-files")
        .upload(fileName, gameFile);

      if (fileError) throw fileError;

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("game-files")
        .getPublicUrl(fileName);

      // Create game record in database with the correct game_type
      const { error: dbError } = await supabase.from("games").insert({
        title,
        description,
        game_url: urlData.publicUrl,
        game_type: "play", // Using 'play' as the game type since it's an allowed value
        user_id: session.user.id,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Your game has been uploaded",
      });
      navigate("/games");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your game",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto pt-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold">Upload Your Game</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Game Title
              </label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter your game's title"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Describe your game"
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label htmlFor="game" className="mb-2 block text-sm font-medium">
                Game File
              </label>
              <Input
                id="game"
                type="file"
                accept=".sb3,.html,.zip"
                onChange={(e) => setGameFile(e.target.files?.[0] || null)}
                required
              />
              <p className="mt-1 text-sm text-gray-400">
                Supported formats: Scratch (.sb3), HTML, ZIP
              </p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Game"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameUpload;