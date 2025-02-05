import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../context/FormContext';
import { PostIdea, ApprovedPost } from '../types/posts';
import { useState, useCallback } from 'react';
import Modal from './ui/Modal';
import PostCard from './PostCard';
import PostConfigurationModal from './PostConfigurationModal';
import ContentCalendarView from './ContentCalendarView';

export default function GeneratedPosts() {
  const {
    generatedPosts,
    setGeneratedPosts,
    selectedPosts,
    setSelectedPosts,
    approvedPosts,
    setApprovedPosts,
  } = useForm();

  const [selectedPost, setSelectedPost] = useState<PostIdea | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<PostIdea | null>(null);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [sortBy, setSortBy] = useState<'confidence' | 'date'>('confidence');
  const [filterByType, setFilterByType] = useState<string | null>(null);
  const [showCalendarView, setShowCalendarView] = useState(false);

  const postsPerBatch = 2;
  const maxPosts = 10;
  const approvedPostsCount = approvedPosts.length;
  const progress = (approvedPostsCount / maxPosts) * 100;

  const sortedPosts = [...generatedPosts].sort((a, b) => 
    sortBy === 'confidence' 
      ? b.confidence_level - a.confidence_level
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredPosts = filterByType 
    ? sortedPosts.filter(post => post.suggested_type === filterByType)
    : sortedPosts;

  const visiblePosts = filteredPosts.slice(0, currentBatch * postsPerBatch);
  const canLoadMore = visiblePosts.length < Math.min(filteredPosts.length, maxPosts);

  const handleLoadMore = useCallback(() => {
    setCurrentBatch(prev => prev + 1);
  }, []);

  const handleDeletePost = useCallback((post: PostIdea) => {
    setShowDeleteConfirm(post);
  }, []);

  const confirmDelete = useCallback(() => {
    if (showDeleteConfirm) {
      const updatedPosts = generatedPosts.filter(p => p !== showDeleteConfirm);
      setGeneratedPosts(updatedPosts);
      setShowDeleteConfirm(null);
    }
  }, [showDeleteConfirm, generatedPosts, setGeneratedPosts]);

  interface ConfiguredPost extends PostIdea {
    publish_date: string;
    due_date: string;
  }

  const handleSaveConfiguration = async (configuredPost: ConfiguredPost) => {
    try {
      // Ensure dates are in YYYY-MM-DD format
      const formattedPost: ApprovedPost = {
        ...configuredPost,
        post_type: configuredPost.suggested_type,
        voice_over_required: false,
        voice_over_type: null,
        publish_date: configuredPost.publish_date.split('T')[0],
        due_date: configuredPost.due_date.split('T')[0]
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPost),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save post configuration');
      }

      // Add to approved posts
      const updatedApprovedPosts = [...approvedPosts, formattedPost];
      setApprovedPosts(updatedApprovedPosts);
      
      // Remove from generated posts
      const updatedGeneratedPosts = generatedPosts.filter(p => p.id !== configuredPost.id);
      setGeneratedPosts(updatedGeneratedPosts);
      
      // Remove from selected posts if it was there
      const updatedSelectedPosts = selectedPosts.filter(p => p.id !== configuredPost.id);
      setSelectedPosts(updatedSelectedPosts);
      
      setSelectedPost(null);
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save post configuration');
    }
  };

  // Navigation to calendar view
  const handleFinishPlanning = () => {
    setShowCalendarView(true);
  };

  if (showCalendarView) {
    return <ContentCalendarView />;
  }

  return (
    <div className="space-y-6">
      {/* Progress and Actions Bar */}
      {generatedPosts.length > 0 && (
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex-1 mr-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Monthly Progress</span>
              <span className="text-sm text-gray-400">{approvedPostsCount} of {maxPosts} posts</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinishPlanning}
            disabled={approvedPostsCount === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${approvedPostsCount > 0
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            Finish Planning
          </motion.button>
        </div>
      )}

      {/* Post List */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-400 to-indigo-500"
          >
            Generated Content
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            {generatedPosts.length} ideas generated • {selectedPosts.length} approved
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4"
        >
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'confidence' | 'date')}
              className="px-4 py-2 rounded-xl border border-gray-700/50
                       bg-gray-800/50 text-white
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-500/30 transition-all duration-300"
            >
              <option value="confidence">Sort by Confidence</option>
              <option value="date">Sort by Date</option>
            </select>

            <select
              value={filterByType || ''}
              onChange={(e) => setFilterByType(e.target.value || null)}
              className="px-4 py-2 rounded-xl border border-gray-700/50
                       bg-gray-800/50 text-white
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                       hover:border-blue-500/30 transition-all duration-300"
            >
              <option value="">All Types</option>
              <option value="reel">Reels</option>
              <option value="static_image">Static Images</option>
              <option value="carousel">Carousels</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={() => setSelectedPost(post)}
              onDelete={() => handleDeletePost(post)}
              isSelected={selectedPost?.id === post.id}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-xl font-medium text-white
                     bg-gradient-to-r from-blue-500 to-indigo-500
                     hover:shadow-lg hover:shadow-blue-500/20
                     transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Load More Ideas
          </motion.button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={!!showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        >
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Post</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Post Configuration Modal */}
      {selectedPost && (
        <PostConfigurationModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onSave={handleSaveConfiguration}
        />
      )}
    </div>
  );
}