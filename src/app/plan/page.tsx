'use client';

import { motion } from 'framer-motion';
import GeneratedPosts from '../../components/GeneratedPosts';
import SocialMediaPlanForm from '../../components/SocialMediaPlanForm';
import { useForm } from '../../context/FormContext';

export default function PlanPage() {
  const { currentStep } = useForm();

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
            Plan Your Content
          </h1>
          <p className="text-gray-400 text-center mb-12">
            {currentStep === 0 ? 'Configure your content strategy' : 'Review and select generated content'}
          </p>
        </motion.div>

        {currentStep === 0 ? (
          <SocialMediaPlanForm />
        ) : (
          <GeneratedPosts />
        )}
      </div>
    </main>
  );
}
