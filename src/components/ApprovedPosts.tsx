import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../context/FormContext';
import Card from './ui/Card';
import debounce from 'lodash/debounce';

export default function ApprovedPosts() {
  const { approvedPosts, fetchApprovedPosts, isLoading, error } = useForm();
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts only once when component mounts
  useEffect(() => {
    const controller = new AbortController();
    fetchApprovedPosts();
    return () => controller.abort();
  }, []); // Empty dependency array means it only runs once on mount

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  // Memoize the filtered and sorted posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!approvedPosts) return [];
    
    return approvedPosts
      .filter(post => {
        if (filterType && post.post_type !== filterType) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            post.post_idea.toLowerCase().includes(query) ||
            post.context.toLowerCase().includes(query) ||
            post.aims.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
        }
        return a.post_type.localeCompare(b.post_type);
      });
  }, [approvedPosts, filterType, searchQuery, sortBy]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'date' | 'type');
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value === 'all' ? null : e.target.value);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="inline-block">
            <svg className="animate-spin h-8 w-8 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[var(--text-secondary)]">Loading approved posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3 text-red-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!approvedPosts?.length) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12 space-y-4">
              <div className="inline-block p-4 bg-[var(--surface)] rounded-full">
                <svg className="h-12 w-12 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[var(--heading-color)]">No Approved Posts Yet</h3>
              <p className="text-[var(--text-secondary)]">
                Start by generating and approving some post ideas from the previous step.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--heading-color)]">
              Approved Posts
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {filteredAndSortedPosts.length} posts scheduled
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="input min-w-[200px]"
            />
            
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="input min-w-[140px]"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
            </select>

            <select
              value={filterType || 'all'}
              onChange={handleFilterChange}
              className="input min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="reel">Reels</option>
              <option value="static_image">Static Images</option>
              <option value="carousel">Carousels</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.post_type === 'reel' 
                              ? 'bg-purple-500/10 text-purple-500' 
                              : post.post_type === 'static_image'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            {post.post_type}
                          </span>
                          {post.voice_over_required && (
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-medium">
                              Voice-over: {post.voice_over_type}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-medium text-[var(--heading-color)]">
                          {post.post_idea}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className="space-y-1">
                            <div>Publish: {new Date(post.publish_date).toLocaleDateString()}</div>
                            <div>Due: {new Date(post.due_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[var(--text-secondary)] text-sm">Aims:</span>
                        <p className="text-[var(--text-color)] mt-1">{post.aims}</p>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)] text-sm">Context:</span>
                        <p className="text-[var(--text-color)] mt-1">{post.context}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}