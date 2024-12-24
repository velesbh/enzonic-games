import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "./Comment";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CommentSectionProps {
  gameId: string;
}

export const CommentSection = ({ gameId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username
          )
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          game_id: gameId,
          user_id: session.user.id,
        });

      if (error) throw error;

      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['comments', gameId] });
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['comments', gameId] });
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Comments</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={session ? "Write a comment..." : "Please sign in to comment"}
          disabled={!session}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={!session || !newComment.trim()}>
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment: any) => (
            <Comment
              key={comment.id}
              content={comment.content}
              username={comment.profiles?.username}
              createdAt={comment.created_at}
              isOwner={session?.user.id === comment.user_id}
              onDelete={() => handleDelete(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};