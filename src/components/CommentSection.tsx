import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "./Comment";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface CommentSectionProps {
  gameId: string;
}

export const CommentSection = ({ gameId }: CommentSectionProps) => {
  const [content, setContent] = useState("");
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from("comments").insert({
        content,
        game_id: gameId,
        user_id: session?.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post comments",
        variant: "destructive",
      });
      return;
    }
    if (!content.trim()) return;
    addCommentMutation.mutate(content);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
        />
        <Button 
          type="submit"
          disabled={!content.trim() || addCommentMutation.isPending}
        >
          Post Comment
        </Button>
      </form>

      {isLoading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              content={comment.content}
              createdAt={comment.created_at}
              isOwner={comment.user_id === session?.user?.id}
              onDelete={() => deleteCommentMutation.mutate(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};