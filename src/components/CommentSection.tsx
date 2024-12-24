import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MessageCircle, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string | null;
    avatar_url: string | null;
  };
}

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
          user:profiles!comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Comment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('comments')
        .insert({
          game_id: gameId,
          user_id: session?.user?.id,
          content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', gameId] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', gameId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim());
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-100">Comments</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <Button 
          type="submit"
          disabled={!session || !newComment.trim()}
          className="w-full sm:w-auto"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-400">No comments yet</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-gray-800/50">
              <Avatar>
                <AvatarImage src={comment.user.avatar_url || undefined} />
                <AvatarFallback>
                  {comment.user.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">
                    {comment.user.username || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-300">{comment.content}</p>
                {session?.user?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    className="mt-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};