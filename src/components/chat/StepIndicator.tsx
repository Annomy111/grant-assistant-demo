'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

interface StepIndicatorProps {
  currentStep: string;
}

const steps: Step[] = [
  {
    id: 'introduction',
    title: 'Grundlagen',
    description: 'Organisation & Projekt',
    status: 'current',
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description: 'Ziele & Methodik',
    status: 'pending',
  },
  {
    id: 'impact',
    title: 'Impact',
    description: 'Wirkung & Verbreitung',
    status: 'pending',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Arbeitsplan & Ressourcen',
    status: 'pending',
  },
  {
    id: 'review',
    title: 'Überprüfung',
    description: 'Finale Kontrolle',
    status: 'pending',
  },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
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
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                  step.status === 'completed' && 'bg-green-500 text-white',
                  step.status === 'current' && 'bg-blue-500 text-white',
                  step.status === 'pending' && 'bg-gray-200 text-gray-500'
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    step.status === 'current' && 'text-blue-600',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'pending' && 'text-gray-400'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < updatedSteps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 mx-2',
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}