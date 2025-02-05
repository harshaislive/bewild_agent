'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { SocialMediaPlanInput, PostIdea, ApprovedPost } from '../types/posts';

interface FormContextType {
  formData: SocialMediaPlanInput;
  setFormData: (data: Partial<SocialMediaPlanInput>) => void;
  generatedPosts: PostIdea[];
  setGeneratedPosts: (posts: PostIdea[]) => void;
  selectedPosts: PostIdea[];
  setSelectedPosts: (posts: PostIdea[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  approvedPosts: ApprovedPost[];
  setApprovedPosts: (posts: ApprovedPost[]) => void;
  regenerateIdeas: () => Promise<void>;
  fetchApprovedPosts: () => Promise<void>;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<SocialMediaPlanInput>({
    monthYear: '',
    brandGuidelines: '',
    targetAudience: '',
    productLaunches: '',
    marketingGoals: '',
    additionalContext: '',
  });

  const [generatedPosts, setGeneratedPosts] = useState<PostIdea[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<PostIdea[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvedPosts, setApprovedPosts] = useState<ApprovedPost[]>([]);

  const setFormData = useCallback((data: Partial<SocialMediaPlanInput>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormDataState({
      monthYear: '',
      brandGuidelines: '',
      targetAudience: '',
      productLaunches: '',
      marketingGoals: '',
      additionalContext: '',
    });
    setGeneratedPosts([]);
    setSelectedPosts([]);
    setCurrentStep(0);
    setError(null);
    setIsLoading(false);
  }, []);

  const regenerateIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ideas');
      }

      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid response format from server');
      }
      
      setGeneratedPosts(data.posts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const fetchApprovedPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);
      
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch approved posts');
      
      const data = await response.json();
      setApprovedPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  const contextValue = useMemo(() => ({
    formData,
    setFormData,
    generatedPosts,
    setGeneratedPosts,
    selectedPosts,
    setSelectedPosts,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    error,
    setError,
    approvedPosts,
    setApprovedPosts,
    regenerateIdeas,
    fetchApprovedPosts,
    resetForm,
  }), [
    formData,
    setFormData,
    generatedPosts,
    selectedPosts,
    currentStep,
    isLoading,
    error,
    approvedPosts,
    regenerateIdeas,
    fetchApprovedPosts,
    resetForm,
  ]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}