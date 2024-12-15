import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const UploadGameButton = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const handleClick = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload games",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate("/games/upload");
  };

  return (
    <Button onClick={handleClick} className="gap-2">
      <Upload className="h-4 w-4" />
      Upload Game
    </Button>
  );
};