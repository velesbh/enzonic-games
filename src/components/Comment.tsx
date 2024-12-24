import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  content: string;
  username: string | null;
  createdAt: string;
  isOwner: boolean;
  onDelete: () => void;
}

export const Comment = ({ content, username, createdAt, isOwner, onDelete }: CommentProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-200">{username || 'Anonymous'}</p>
          <p className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={onDelete}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-300">{content}</p>
    </div>
  );
};