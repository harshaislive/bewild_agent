'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../context/FormContext';

const formSteps = [
  {
    id: 'basics',
    title: 'Select Campaign Month',
    description: 'Choose the month for your social media content plan',
    fields: ['monthYear']
  },
  {
    id: 'brand',
    title: 'Brand Identity',
    description: 'Define your brand voice and target audience',
    fields: ['brandGuidelines', 'targetAudience']
  },
  {
    id: 'strategy',
    title: 'Marketing Strategy',
    description: 'Set your marketing goals and upcoming launches',
    fields: ['marketingGoals', 'productLaunches']
  },
  {
    id: 'context',
    title: 'Additional Context (Optional)',
    description: 'Add any other relevant information if needed',
    fields: ['additionalContext'],
    optional: true
  }
];

export default function SocialMediaPlanForm() {
  const {
    formData,
    setFormData,
    error,
    setError,
    regenerateIdeas,
    setCurrentStep,
    isLoading
  } = useForm();
  const [currentFormStep, setCurrentFormStep] = useState(0);

  const currentStepConfig = formSteps[currentFormStep];

  const handleNext = () => {
    const isValid = currentStepConfig.fields.every(field => {
      // Skip validation for optional fields
      if (field === 'additionalContext' || field === 'productLaunches') return true;
      return formData[field as keyof typeof formData]?.trim();
    });

    if (isValid && currentFormStep < formSteps.length - 1) {
      setCurrentFormStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate required fields
    const requiredFields = ['monthYear', 'brandGuidelines', 'targetAudience', 'marketingGoals'];
    const isValid = requiredFields.every(field => 
      formData[field as keyof typeof formData]?.trim()
    );

    if (!isValid) {
      setError('Please fill in all required fields');
      return;
    }

    // Don't proceed if already loading
    if (isLoading) return;

    setError(null);
    
    try {
      await regenerateIdeas();
      setCurrentStep(1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate ideas. Please try again.');
      console.error('Failed to generate ideas:', error);
    }
  };

  const renderField = (fieldName: string) => {
    const baseInputClasses = "w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl " +
                           "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 " +
                           "placeholder-gray-500 text-white backdrop-blur-sm transition-all";

    switch (fieldName) {
      case 'monthYear':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="monthYear" className="block text-lg font-medium text-white">
              Campaign Month
            </label>
            <input
              type="month"
              id="monthYear"
              value={formData.monthYear}
              onChange={(e) => setFormData({ monthYear: e.target.value })}
              className={baseInputClasses}
              required
            />
          </div>
        );

      case 'brandGuidelines':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="brandGuidelines" className="block text-lg font-medium text-white">
              Brand Guidelines
            </label>
            <textarea
              id="brandGuidelines"
              value={formData.brandGuidelines}
              onChange={(e) => setFormData({ brandGuidelines: e.target.value })}
              placeholder="Enter your brand guidelines..."
              className={`${baseInputClasses} min-h-[120px]`}
              required
            />
          </div>
        );

      case 'targetAudience':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="targetAudience" className="block text-lg font-medium text-white">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ targetAudience: e.target.value })}
              placeholder="Describe your target audience..."
              className={`${baseInputClasses} min-h-[120px]`}
              required
            />
          </div>
        );

      case 'marketingGoals':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="marketingGoals" className="block text-lg font-medium text-white">
              Marketing Goals
            </label>
            <textarea
              id="marketingGoals"
              value={formData.marketingGoals}
              onChange={(e) => setFormData({ marketingGoals: e.target.value })}
              placeholder="What are your marketing goals?"
              className={`${baseInputClasses} min-h-[120px]`}
              required
            />
          </div>
        );

      case 'productLaunches':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="productLaunches" className="block text-lg font-medium text-white">
              Product Launches
              <span className="text-sm text-gray-400 ml-2">(Optional)</span>
            </label>
            <textarea
              id="productLaunches"
              value={formData.productLaunches}
              onChange={(e) => setFormData({ productLaunches: e.target.value })}
              placeholder="Any upcoming product launches?"
              className={`${baseInputClasses} min-h-[120px]`}
            />
          </div>
        );

      case 'additionalContext':
        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor="additionalContext" className="block text-lg font-medium text-white">
              Additional Context
              <span className="text-sm text-gray-400 ml-2">(Optional)</span>
            </label>
            <textarea
              id="additionalContext"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ additionalContext: e.target.value })}
              placeholder="Any other relevant information you'd like to add..."
              className={`${baseInputClasses} min-h-[120px]`}
            />
            <p className="text-sm text-gray-400 mt-1">
              Add any other relevant information that could help in generating better content ideas.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-8 shadow-xl"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {formSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  ${index <= currentFormStep 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                    : 'bg-gray-700/50 text-gray-400'
                  }
                  transition-all duration-300
                `}>
                  {index + 1}
                </div>
                {index < formSteps.length - 1 && (
                  <div className="flex-1 h-1 mx-2">
                    <div className="h-full bg-gray-700/50 rounded-full">
                      <motion.div
                        initial={false}
                        animate={{
                          width: index < currentFormStep ? '100%' : '0%'
                        }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              {currentStepConfig.title}
            </h2>
            <p className="text-gray-400 mt-1">
              {currentStepConfig.description}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFormStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {currentStepConfig.fields.map(fieldName => renderField(fieldName))}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-between pt-6">
            <motion.button
              type="button"
              onClick={handleBack}
              className={`
                px-6 py-3 rounded-xl text-white font-medium
                ${currentFormStep === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50'}
                transition-all duration-300
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>

            {currentFormStep === formSteps.length - 1 ? (
              <div className="flex gap-4">
                {currentStepConfig.optional && (
                  <motion.button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-medium text-gray-400
                           bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    Skip & Generate
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    px-6 py-3 rounded-xl font-medium
                    bg-gradient-to-r from-blue-500 to-indigo-500
                    hover:shadow-lg hover:shadow-blue-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Ideas...
                    </span>
                  ) : (
                    'Generate Ideas'
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={handleNext}
                className="
                  px-6 py-3 rounded-xl font-medium text-white
                  bg-gradient-to-r from-blue-500 to-indigo-500
                  hover:shadow-lg hover:shadow-blue-500/20
                  transition-all duration-300
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}