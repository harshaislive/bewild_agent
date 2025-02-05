'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useForm } from '../context/FormContext';
import SocialMediaPlanForm from '../components/SocialMediaPlanForm';
import GeneratedPosts from '../components/GeneratedPosts';
import ContentCalendarView from '../components/ContentCalendarView';
import { supabase, withRetry } from '../lib/supabase';
import Loading from './loading';
import { ApprovedPost } from '../types/posts';

interface CustomError {
  message: string;
}

export default function Home() {
  const { approvedPosts, setApprovedPosts } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApprovedPosts() {
      try {
        const query = async () => {
          const result = await supabase
            .from('approvedposts')
            .select('*')
            .order('due_date', { ascending: true });
          return result;
        };

        const response = await withRetry<ApprovedPost[]>(query);

        if (response.error) throw response.error;
        
        // Filter out any null values and ensure we have an array
        const posts = (Array.isArray(response.data) ? response.data : [response.data])
          .filter((post): post is ApprovedPost => post !== null);
          
        setApprovedPosts(posts);
      } catch (err: unknown) {
        console.error('Error loading approved posts:', err);
        const error = err as CustomError;
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadApprovedPosts();
  }, [setApprovedPosts]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Posts</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // If there are approved posts, show the calendar view by default
  if (approvedPosts.length > 0) {
    return (
      <Suspense fallback={<Loading />}>
        <ContentCalendarView />
      </Suspense>
    );
  }

  // If no posts, show the planning flow
  return (
    <Suspense fallback={<Loading />}>
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
              Social Media Planner
            </h1>
            <p className="text-gray-400 text-center mb-12">
              Create engaging social media content with the power of AI
            </p>
          </motion.div>

          {/* Only show form initially, GeneratedPosts will be shown after form submission */}
          {!approvedPosts.length && (
            <>
              <SocialMediaPlanForm />
              <GeneratedPosts />
            </>
          )}
        </div>
      </main>
    </Suspense>
  );
}
