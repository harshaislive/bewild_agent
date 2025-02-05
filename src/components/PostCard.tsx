'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { PostIdea, ApprovedPost } from '../types/posts';

interface PostCardProps {
  post: PostIdea | ApprovedPost;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  showActions?: boolean;
}

export default function PostCard({
  post,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
  showActions = true
}: PostCardProps) {
  const getTypeIcon = (type: string | undefined) => {
    switch (type) {
      case 'reel':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'carousel':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const dueDate = 'due_date' in post && post.due_date ? format(new Date(post.due_date), 'MMM dd, yyyy') : null;
  const postType = 'post_type' in post ? post.post_type : ('suggested_type' in post ? post.suggested_type : undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative overflow-hidden rounded-2xl
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/50' 
          : 'bg-gray-800/30 border border-gray-700/50'
        }
        backdrop-blur-xl shadow-xl
        transition-all duration-300
        hover:shadow-2xl hover:shadow-blue-500/10
        ${onSelect ? 'cursor-pointer' : ''}
      `}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Confidence Level Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-gray-700/50 backdrop-blur-sm text-sm font-medium">
          {'confidence_level' in post ? post.confidence_level : 0}/10
        </div>
      </div>

      {/* Content Type Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={`
          px-3 py-1 rounded-full 
          bg-gradient-to-r from-blue-500/20 to-indigo-500/20
          border border-blue-500/30
          text-sm font-medium flex items-center gap-2
        `}>
          {getTypeIcon(postType)}
          <span className="capitalize">{postType}</span>
        </div>
      </div>

      <div className="p-6 pt-16">
        {/* Main Content */}
        <div className="space-y-4">
          <p className="text-lg text-white font-medium leading-relaxed">
            {post.post_idea}
          </p>
          
          {/* Aims */}
          <div className="flex flex-wrap gap-2 mt-4">
            {'aims' in post && post.aims.map((aim, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm
                         bg-gray-700/30 text-gray-300
                         border border-gray-600/30"
              >
                {aim}
              </span>
            ))}
          </div>

          {/* Context */}
          {'context' in post && post.context && (
            <div className="mt-4 p-4 rounded-xl bg-gray-700/20 border border-gray-600/20">
              <p className="text-gray-300 text-sm">{post.context}</p>
            </div>
          )}

          {/* Reference Materials */}
          {'reference_materials' in post && post.reference_materials && post.reference_materials.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Reference Materials:</h4>
              <ul className="list-disc list-inside space-y-1">
                {post.reference_materials.map((material, index) => (
                  <li key={index} className="text-sm text-gray-300">
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due Date: {dueDate}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-700/50">
            {onEdit && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-4 py-2 rounded-lg font-medium text-white
                         bg-gradient-to-r from-blue-500 to-indigo-500
                         hover:shadow-lg hover:shadow-blue-500/20
                         transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Configure
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="px-4 py-2 rounded-lg font-medium
                         bg-red-500/10 text-red-400
                         hover:bg-red-500/20
                         transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}