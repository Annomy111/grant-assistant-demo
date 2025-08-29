'use client';

import { useState, useEffect } from 'react';
import { FileText, ChevronRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Template {
  id: string;
  name: string;
  description: string;
  actionType: string;
  programType: string;
  metadata: {
    fundingRate: number;
    typicalDuration: string;
    typicalBudget: string;
    trlRange?: string;
  };
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  projectContext?: any;
}

export function TemplateSelector({ onSelectTemplate, projectContext }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [recommendedTemplate, setRecommendedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetchTemplates();
    if (projectContext) {
      selectBestTemplate();
    }
  }, [language, projectContext]);

  const fetchTemplates = async () => {
    try {
      // Fetch all templates regardless of language to show all options
      const response = await fetch(`/api/templates`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectBestTemplate = async () => {
    if (!projectContext) return;
    
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'select',
          context: projectContext
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendedTemplate(data.template?.id);
      }
    } catch (error) {
      console.error('Failed to select template:', error);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelectTemplate(templateId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {language === 'de' ? 'Vorlagen für Ihren Antrag' : 'Templates for Your Application'}
        </h3>
        <p className="text-sm text-blue-700">
          {language === 'de' 
            ? 'Wählen Sie eine Vorlage, die zu Ihrem Projekt passt. Die KI wird diese nutzen, um strukturierte Inhalte zu generieren.'
            : 'Choose a template that matches your project. The AI will use this to generate structured content.'}
        </p>
      </div>

      <div className="grid gap-3">
        {templates.map((template) => {
          const isRecommended = template.id === recommendedTemplate;
          const isSelected = template.id === selectedTemplate;

          return (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : isRecommended 
                    ? 'border-blue-400 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    {isRecommended && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {language === 'de' ? 'Empfohlen' : 'Recommended'}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">
                        {language === 'de' ? 'Typ:' : 'Type:'}
                      </span>
                      <span className="ml-1 font-medium text-gray-700">
                        {template.actionType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {language === 'de' ? 'Förderquote:' : 'Funding:'}
                      </span>
                      <span className="ml-1 font-medium text-gray-700">
                        {template.metadata.fundingRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {language === 'de' ? 'Budget:' : 'Budget:'}
                      </span>
                      <span className="ml-1 font-medium text-gray-700">
                        {template.metadata.typicalBudget}
                      </span>
                    </div>
                    {template.metadata.trlRange && (
                      <div>
                        <span className="text-gray-500">TRL:</span>
                        <span className="ml-1 font-medium text-gray-700">
                          {template.metadata.trlRange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ChevronRight className={`
                  w-5 h-5 ml-4 transition-transform
                  ${isSelected ? 'rotate-90 text-green-600' : 'text-gray-400'}
                `} />
              </div>
            </div>
          );
        })}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{language === 'de' ? 'Keine Vorlagen verfügbar' : 'No templates available'}</p>
        </div>
      )}

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            {language === 'de'
              ? '✅ Vorlage ausgewählt! Die KI wird diese Struktur für Ihren Antrag verwenden.'
              : '✅ Template selected! The AI will use this structure for your application.'}
          </p>
        </div>
      )}
    </div>
  );
}