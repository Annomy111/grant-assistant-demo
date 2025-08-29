'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  id: string;
  titleKey: string;
  descriptionKey: string;
  status: 'completed' | 'current' | 'pending';
}

interface StepIndicatorProps {
  currentStep: string;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useLanguage();
  
  const steps: Step[] = [
    {
      id: 'introduction',
      titleKey: 'steps.introduction.title',
      descriptionKey: 'steps.introduction.description',
      status: 'current',
    },
    {
      id: 'excellence',
      titleKey: 'steps.excellence.title',
      descriptionKey: 'steps.excellence.description',
      status: 'pending',
    },
    {
      id: 'impact',
      titleKey: 'steps.impact.title',
      descriptionKey: 'steps.impact.description',
      status: 'pending',
    },
    {
      id: 'implementation',
      titleKey: 'steps.implementation.title',
      descriptionKey: 'steps.implementation.description',
      status: 'pending',
    },
    {
      id: 'review',
      titleKey: 'steps.review.title',
      descriptionKey: 'steps.review.description',
      status: 'pending',
    },
  ];
  const updatedSteps = steps.map((step, index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (index < currentIndex) {
      return { ...step, status: 'completed' as const };
    } else if (index === currentIndex) {
      return { ...step, status: 'current' as const };
    } else {
      return { ...step, status: 'pending' as const };
    }
  });
  
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border-b shadow-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md',
                  step.status === 'pending' && 'bg-gray-100 text-gray-400',
                  step.status === 'current' && 'ring-4 ring-blue-200 animate-pulse'
                )}
                style={{
                  backgroundColor: step.status === 'completed' ? '#10b981' : 
                                   step.status === 'current' ? '#3b82f6' : undefined,
                  color: step.status !== 'pending' ? 'white' : undefined
                }}
              >
                {step.status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-lg">{index + 1}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    step.status === 'current' && 'text-blue-600',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'pending' && 'text-gray-400'
                  )}
                >
                  {t(step.titleKey)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t(step.descriptionKey)}
                </p>
              </div>
            </div>
            
            {index < updatedSteps.length - 1 && (
              <div className="flex items-center px-3">
                <div
                  className={cn(
                    'h-1 w-16 rounded-full transition-all',
                    step.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}