'use client';

import { HelpCircle, FileText, SkipForward, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const { t } = useLanguage();
  
  const actions = [
    {
      id: 'use_template',
      label: `✨ ${t('quickActions.templates')}`,
      icon: Sparkles,
    },
    {
      id: 'cluster2_may',
      label: t('quickActions.cluster2'),
      icon: FileText,
    },
    {
      id: 'cerv_ukraine',
      label: t('quickActions.cervUkraine'),
      icon: CheckCircle,
    },
    {
      id: 'ua_mandatory',
      label: t('quickActions.uaMandatory'),
      icon: HelpCircle,
    },
    {
      id: 'two_stage',
      label: t('quickActions.twoStage'),
      icon: SkipForward,
    },
  ];
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all"
            style={{
              borderColor: 'rgba(48, 73, 69, 0.3)',
              color: '#304945',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(48, 73, 69, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(48, 73, 69, 0.3)';
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}