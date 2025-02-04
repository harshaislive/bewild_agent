import { useState, useEffect } from 'react';
import { PostIdea, PostType, VoiceOverType, ApprovedPost } from '../types/posts';
import Modal from './ui/Modal';
import { motion } from 'framer-motion';

interface PostConfigurationModalProps {
  post: PostIdea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: ApprovedPost) => Promise<boolean>;
}

export default function PostConfigurationModal({
  post,
  isOpen,
  onClose,
  onSave,
}: PostConfigurationModalProps) {
  const [postType, setPostType] = useState<PostType>(post?.suggested_type || 'static_image');
  const [voiceOverRequired, setVoiceOverRequired] = useState(false);
  const [voiceOverType, setVoiceOverType] = useState<VoiceOverType>('none');
  const [publishDate, setPublishDate] = useState(post?.best_time?.split('T')[0] || '');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post && isOpen) {
      setPostType(post.suggested_type || 'static_image');
      setPublishDate(post.best_time?.split('T')[0] || '');
      setDueDate('');
      setError(null);
    }
  }, [post, isOpen]);

  if (!post || !isOpen) return null;

  const handleSave = async () => {
    if (!publishDate || !dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Client-side date validation
    const publishDateObj = new Date(publishDate);
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateObj < today) {
      setError('Due date cannot be in the past');
      return;
    }

    if (publishDateObj < today) {
      setError('Publish date cannot be in the past');
      return;
    }

    if (dueDateObj > publishDateObj) {
      setError('Due date must be before or on the publish date');
      return;
    }

    setIsSaving(true);
    setError(null);

    const approvedPost: ApprovedPost = {
      ...post,
      post_type: postType,
      voice_over_required: voiceOverRequired,
      voice_over_type: voiceOverRequired ? voiceOverType : null,
      publish_date: publishDate,
      due_date: dueDate,
    };

    try {
      await onSave(approvedPost);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Configure Post
            </h2>
            <p className="mt-2 text-gray-400 line-clamp-2">{post.post_idea}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {post.aims.map((aim, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-gray-400 border border-gray-700/50"
                >
                  {aim}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Post Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['static_image', 'carousel', 'reel'] as PostType[]).map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPostType(type)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${postType === type 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                      }
                    `}
                  >
                    {type.replace('_', ' ').toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice Over */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Voice Over
              </label>
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={voiceOverRequired}
                    onChange={(e) => setVoiceOverRequired(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Requires voice over</span>
                </div>
                
                {voiceOverRequired && (
                  <select
                    value={voiceOverType}
                    onChange={(e) => setVoiceOverType(e.target.value as VoiceOverType)}
                    className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-gray-300
                           focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                           backdrop-blur-sm"
                  >
                    <option value="none">Select voice over type</option>
                    <option value="internal_recording">Internal Recording</option>
                    <option value="ai_generated">AI Generated</option>
                  </select>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300
                         focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                         backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300
                         focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                         backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-gray-300
                     bg-gray-800/50 hover:bg-gray-700/50
                     border border-gray-700/50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-white
                ${isSaving 
                  ? 'bg-blue-500/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/20'
                }
              `}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
