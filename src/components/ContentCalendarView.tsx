'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isBefore } from 'date-fns';
import { useForm } from '../context/FormContext';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard';

interface ContentCalendarViewProps {
  showBackButton?: boolean;
}

export default function ContentCalendarView({ showBackButton = false }: ContentCalendarViewProps) {
  const { approvedPosts, resetForm } = useForm();
  const router = useRouter();

  // Sort posts by due date
  const sortedPosts = [...approvedPosts].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    return dateA.getTime() - dateB.getTime();
  });

  // Find the nearest due date post
  const now = new Date();
  const nearestPost = sortedPosts.find(post => isBefore(now, new Date(post.due_date))) || sortedPosts[0];

  const handleGenerateIdeas = () => {
    router.push('/plan'); // Simply navigate to planning page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Content Calendar
          </motion.h1>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateIdeas}
            className="glass-button primary"
          >
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Generate Ideas
            </span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {sortedPosts.map((post, index) => {
            const isActive = post.id === nearestPost?.id;
            const isPast = isBefore(new Date(post.due_date), now);
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card ${isActive ? 'active' : ''} p-6`}
              >
                <div className="absolute top-4 right-4 z-10">
                  {isActive ? (
                    <div className="glass-tag active flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      Current Focus
                    </div>
                  ) : isPast ? (
                    <div className="glass-tag flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      Past
                    </div>
                  ) : (
                    <div className="glass-tag flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      Upcoming
                    </div>
                  )}
                </div>

                <PostCard
                  post={post}
                  showActions={false}
                  isActive={isActive}
                />

                {/* Lock Overlay for Inactive Future Posts */}
                {!isActive && !isPast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 blur-backdrop flex items-center justify-center bg-black/20"
                  >
                    <div className="text-center p-6 glass-card">
                      <svg
                        className="w-8 h-8 mx-auto mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <p className="text-gray-400 text-sm">
                        Focus on current post first
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {approvedPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <p className="text-gray-400">
              No approved posts yet. Start by generating some topic ideas!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
