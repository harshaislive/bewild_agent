import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useForm } from '../context/FormContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentStep } = useForm();

  const steps = [
    { name: 'Plan', description: 'Create your content plan' },
    { name: 'Review', description: 'Review generated posts' },
    { name: 'Manage', description: 'Manage approved posts' }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
      >
        <header className="mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Logo and Title */}
            <div className="inline-block">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative"
              >
                <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]
                           animate-gradient bg-300% pb-2">
                  Social Media Planner
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1
                            bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full" />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[var(--text-secondary)] text-xl sm:text-2xl max-w-3xl mx-auto font-light"
            >
              Create engaging social media content with the power of AI
            </motion.p>

            {/* Progress Steps */}
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8"
            >
              <ol className="flex items-center justify-center space-x-8">
                {steps.map((step, index) => {
                  const isCurrent = (currentStep <= 3 && index === 0) ||
                                  (currentStep === 4 && index === 1) ||
                                  (currentStep === 5 && index === 2);
                  const isCompleted = (index === 0 && currentStep > 3) ||
                                    (index === 1 && currentStep > 4);
                  
                  return (
                    <li key={step.name} className="relative">
                      <div className="flex items-center">
                        <div className={`
                          relative flex h-12 w-12 items-center justify-center rounded-full
                          ${isCompleted 
                            ? 'bg-[var(--success)] text-white' 
                            : isCurrent
                              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white'
                              : 'bg-[var(--surface)] text-[var(--text-secondary)]'
                          }
                          transition-all duration-300
                        `}>
                          {isCompleted ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="font-medium">{index + 1}</span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`
                            absolute top-6 left-12 h-0.5 w-24 -translate-y-1/2
                            ${isCompleted ? 'bg-[var(--success)]' : 'bg-[var(--border)]'}
                            transition-all duration-300
                          `} />
                        )}
                      </div>
                      <div className="mt-3">
                        <span className={`
                          block text-sm font-medium
                          ${isCurrent ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}
                        `}>
                          {step.name}
                        </span>
                        <span className="block text-xs text-[var(--text-secondary)]">
                          {step.description}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </motion.nav>
          </motion.div>
        </header>

        <motion.main
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative"
        >
          <div className="card backdrop-blur-sm bg-opacity-50 
                       border border-[var(--border)] shadow-lg
                       dark:shadow-none dark:backdrop-blur-xl">
            {children}
          </div>
        </motion.main>

        <footer className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-[var(--text-secondary)]">
              {new Date().getFullYear()} Social Media Planner. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                Terms
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                Contact
              </a>
            </div>
          </motion.div>
        </footer>
      </motion.div>
    </div>
  );
}