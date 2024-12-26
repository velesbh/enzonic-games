import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  content: string;
  createdAt: string;
  isOwner: boolean;
  onDelete: () => void;
}

export const Comment = ({ content, createdAt, isOwner, onDelete }: CommentProps) => {
  return (
    <div className="border-b border-gray-700 py-4">
      <div className="flex justify-between">
        <p className="text-gray-300">{content}</p>
        {isOwner && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 text-sm"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </p>
    </div>
  );
};