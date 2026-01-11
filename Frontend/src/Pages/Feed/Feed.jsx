import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from "../../util/UserContext";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import PostSkeleton from "./PostSkeleton";

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostsCount, setNewPostsCount] = useState(0);
  const observer = useRef();
  const socketRef = useRef(null);

  const domains = ["All", "Programming", "Design", "Business", "Marketing", "Writing"];

  useEffect(() => {
    // Initialize socket connection
    try {
      const baseURL = axios.defaults.baseURL;
      socketRef.current = io(baseURL, {
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket");
        socketRef.current.emit("join feed");
      });

      socketRef.current.on("new post", (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
        setNewPostsCount((prev) => prev + 1);
        toast.info("📬 New post available!", { autoClose: 2000 });
      });

      socketRef.current.on("post updated", ({ postId, likesCount, commentsCount }) => {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? { ...post, likes: post.likes.slice(0, likesCount), likesCount, commentsCount }
              : post
          )
        );
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchPosts = useCallback(
    async (pageNum, domain) => {
      setLoading(true);
      try {
        const { data } = await axios.get("/post/feed", {
          params: { page: pageNum, limit: 10, domain: domain === "All" ? "" : domain },
        });

        if (data.success) {
          setPosts((prev) =>
            pageNum === 1 ? data.data.posts : [...prev, ...data.data.posts]
          );
          setHasMore(data.data.hasMore);
        }
      } catch (error) {
        console.error("Error loading feed:", error);
        if (error.response?.status === 401) {
          // toast.error("Please login to view feed");
          // localStorage.removeItem("userInfo");
          // navigate("/login");
          // Suppress redirect loop if token is just expired or something, assume context handles it or user stays on page slightly broken
        } else {
          // suppress error toast on initial load to avoid spamming if backend is down
          if (pageNum > 1) toast.error("Error loading more posts");
        }
      } finally {
        setLoading(false);
        if (pageNum === 1) setInitialLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    // Reset and fetch posts when domain changes
    setPage(1);
    setPosts([]);
    fetchPosts(1, selectedDomain);
  }, [selectedDomain, fetchPosts]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, selectedDomain);
    }
  }, [page, selectedDomain, fetchPosts]);

  const handleCreatePost = async (postData) => {
    try {
      const { data } = await axios.post("/post", postData);
      if (data.success) {
        toast.success("Post created successfully");
        setShowCreateModal(false);
        // Post will be added via socket or manual refetch if socket fails
        if (!socketRef.current?.connected) {
          fetchPosts(1, selectedDomain);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Domain Filter</h3>
            <div className="space-y-2">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedDomain === domain
                    ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } `}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Filter (horizontal scroll) */}
        <div className="lg:hidden col-span-1 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex space-x-2">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedDomain === domain
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } `}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar with New Posts Badge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search posts by content or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {newPostsCount > 0 && (
                <button
                  onClick={() => { setNewPostsCount(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  {newPostsCount} New
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.picture || "/default-avatar.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-left text-gray-500 rounded-full px-6 py-3 transition-colors text-sm sm:text-base cursor-pointer"
              >
                What do you want to share or learn today?
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Skeleton Loaders for Initial Load */}
            {initialLoading && (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}

            {/* Filter posts by search query */}
            {!initialLoading && (() => {
              const filteredPosts = searchQuery
                ? posts.filter(post =>
                  post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                : posts;

              return (
                <>
                  {filteredPosts.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">{searchQuery ? '🔍' : '📝'}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {searchQuery ? 'No matching posts' : 'No posts yet'}
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-1">
                        {searchQuery
                          ? `No posts found matching "${searchQuery}"`
                          : `Be the first to share your knowledge or ask a question in the ${selectedDomain} domain!`}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Create Post
                        </button>
                      )}
                    </div>
                  )}

                  {filteredPosts.map((post, index) => (
                    <div
                      key={post._id}
                      ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </>
              );
            })()}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">You've reached the end of the feed</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Optional - e.g. Suggested Peers or Trending) */}
        <div className="hidden xl:block xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Skills</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Python", "UI Design", "Marketing", "Public Speaking"].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                  #{skill}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Who to follow</h3>
              {/* Placeholder for future logic */}
              <p className="text-sm text-gray-500 italic">Recommendations coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default Feed;