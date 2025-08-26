'use client';

import { HelpCircle, FileText, SkipForward, CheckCircle } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: 'help',
      label: 'Hilfe',
      icon: HelpCircle,
      color: 'text-blue-600 hover:bg-blue-50',
    },
    {
      id: 'example',
      label: 'Beispiel zeigen',
      icon: FileText,
      color: 'text-green-600 hover:bg-green-50',
    },
    {
      id: 'skip',
      label: 'Überspringen',
      icon: SkipForward,
      color: 'text-orange-600 hover:bg-orange-50',
    },
    {
      id: 'review',
      label: 'Überprüfen',
      icon: CheckCircle,
      color: 'text-purple-600 hover:bg-purple-50',
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
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full
              border text-sm whitespace-nowrap transition-colors
              ${action.color}
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}