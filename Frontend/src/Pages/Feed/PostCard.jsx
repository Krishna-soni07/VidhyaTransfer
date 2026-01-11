import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaHeart, FaComment, FaTrash } from "react-icons/fa";
import { useUser } from "../../util/UserContext";

const PostCard = ({ post }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.some((like) => like._id === user._id || like === user._id));
    }
    setLikesCount(post.likes?.length || 0);
    setCommentsCount(post.comments?.length || 0);
    setComments(post.comments || []);
  }, [post, user]);

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`/post/${post._id}/like`);
      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikesCount(data.data.likesCount);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error liking post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`/post/${post._id}/comment`, {
        content: newComment,
      });
      if (data.success) {
        setComments([...comments, data.data]);
        setCommentsCount(commentsCount + 1);
        setNewComment("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/post/${post._id}`);
      if (data.success) {
        toast.success("Post deleted");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const isAuthor = user && (post.author?._id === user._id || post.author === user._id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.picture || "/default-avatar.png"}
            alt={post.author?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div>
            <h4 className="font-semibold text-gray-900 leading-tight">{post.author?.name || "Unknown User"}</h4>
            <span className="text-xs text-gray-500">{formatTime(post.createdAt)}</span>
          </div>
        </div>
        {isAuthor && (
          <button
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            onClick={handleDelete}
            title="Delete post"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.skills && post.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.skills.map((skill, index) => (
            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {skill.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
          onClick={handleLike}
        >
          <FaHeart className={isLiked ? "fill-current" : ""} />
          <span>{likesCount}</span>
        </button>
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>{commentsCount}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={comment.user?.picture || "/default-avatar.png"}
                    alt={comment.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-gray-50 rounded-lg p-3 flex-1">
                    <span className="text-sm font-semibold text-gray-900 block mb-1">{comment.user?.name || "Unknown"}</span>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              maxLength={500}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading || !newComment.trim()}
            >
              {loading ? "..." : "Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;

