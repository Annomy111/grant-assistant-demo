'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Check, AlertCircle, Clock, FileText } from 'lucide-react';
import { useApplicationContext } from '@/hooks/useApplicationContext';
import { cn } from '@/lib/utils';

interface SubSection {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  wordLimit?: number;
  currentWords?: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
  subsections?: SubSection[];
  status: 'completed' | 'in_progress' | 'pending' | 'locked';
  completionPercentage: number;
  wordCount?: number;
  maxWords?: number;
}

const SECTIONS_CONFIG: Section[] = [
  {
    id: 'introduction',
    title: 'Grundlagen',
    description: 'Organisation & Projektübersicht',
    status: 'pending',
    completionPercentage: 0,
    subsections: [
      { id: 'org-info', title: 'Organisationsdaten', required: true },
      { id: 'project-basics', title: 'Projektgrundlagen', required: true },
      { id: 'call-selection', title: 'Call-Auswahl', required: true },
      { id: 'consortium', title: 'Konsortium', required: false }
    ]
  },
  {
    id: 'excellence',
    title: 'Excellence',
    description: 'Ziele, Methodik & Innovation',
    status: 'pending',
    completionPercentage: 0,
    maxWords: 15000,
    subsections: [
      { id: 'objectives', title: '1.1 Objectives & Ambition', required: true, wordLimit: 4000 },
      { id: 'methodology', title: '1.2 Methodology', required: true, wordLimit: 4000 },
      { id: 'beyond-sota', title: '1.3 Beyond State-of-Art', required: true, wordLimit: 3000 },
      { id: 'interdisciplinary', title: '1.4 Inter/Multi-disciplinary', required: false, wordLimit: 2000 }
    ]
  },
  {
    id: 'impact',
    title: 'Impact',
    description: 'Wirkung & Verbreitung',
    status: 'pending',
    completionPercentage: 0,
    maxWords: 10000,
    subsections: [
      { id: 'expected-impacts', title: '2.1 Expected Impacts', required: true, wordLimit: 3000 },
      { id: 'dissemination', title: '2.2 Dissemination', required: true, wordLimit: 2500 },
      { id: 'exploitation', title: '2.3 Exploitation', required: true, wordLimit: 2500 },
      { id: 'communication', title: '2.4 Communication', required: false, wordLimit: 2000 }
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Arbeitsplan & Ressourcen',
    status: 'pending',
    completionPercentage: 0,
    maxWords: 10000,
    subsections: [
      { id: 'work-packages', title: '3.1 Work Packages', required: true, wordLimit: 4000 },
      { id: 'consortium-comp', title: '3.2 Consortium', required: true, wordLimit: 2000 },
      { id: 'resources', title: '3.3 Resources', required: true, wordLimit: 2000 },
      { id: 'risks', title: '3.4 Risk Management', required: false, wordLimit: 2000 }
    ]
  },
  {
    id: 'review',
    title: 'Überprüfung',
    description: 'Finale Kontrolle & Export',
    status: 'pending',
    completionPercentage: 0,
    subsections: [
      { id: 'completeness', title: 'Vollständigkeitsprüfung', required: true },
      { id: 'compliance', title: 'Compliance Check', required: true },
      { id: 'export', title: 'Dokument Export', required: false }
    ]
  }
];

interface SectionSidebarProps {
  currentSection: string;
  currentSubSection?: string;
  onSectionChange: (sectionId: string, subSectionId?: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SectionSidebar({ 
  currentSection, 
  currentSubSection,
  onSectionChange,
  isCollapsed = false,
  onToggleCollapse
}: SectionSidebarProps) {
  const { context, getSectionStatus, getOverallCompletion } = useApplicationContext();
  const [expandedSections, setExpandedSections] = useState<string[]>([currentSection]);
  const overallCompletion = getOverallCompletion();
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  const getSectionIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'locked':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getSectionStatusForDisplay = (sectionId: string): Section => {
    const sectionProgress = getSectionStatus(sectionId);
    const baseSection = SECTIONS_CONFIG.find(s => s.id === sectionId) || SECTIONS_CONFIG[0];
    
    if (!sectionProgress) {
      return baseSection;
    }
    
    return {
      ...baseSection,
      status: sectionProgress.status === 'validated' ? 'completed' : 
              sectionProgress.status === 'in_progress' ? 'in_progress' :
              sectionProgress.status === 'completed' ? 'completed' : 'pending',
      completionPercentage: sectionProgress.completionPercentage,
      wordCount: sectionProgress.wordCount
    };
  };
  
  if (isCollapsed) {
    return (
      <div className="w-16 bg-gradient-to-b from-gray-50 to-gray-100 border-r flex flex-col items-center py-4 space-y-3 shadow-lg">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-md"
          title="Seitenleiste erweitern"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {SECTIONS_CONFIG.map((section, index) => {
          const sectionData = getSectionStatusForDisplay(section.id);
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                currentSection === section.id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              )}
              title={section.title}
            >
              {sectionData.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-r flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="px-5 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Antragsübersicht</h3>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Seitenleiste minimieren"
            >
              <ChevronDown className="w-4 h-4 transform -rotate-90" />
            </button>
          )}
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>Gesamtfortschritt</span>
            <span className="text-blue-600 font-semibold">{overallCompletion.percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 shadow-sm"
              style={{ width: `${overallCompletion.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {overallCompletion.completedSections} von {overallCompletion.totalSections} Abschnitten
          </p>
        </div>
      </div>
      
      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        {SECTIONS_CONFIG.map((section) => {
          const sectionData = getSectionStatusForDisplay(section.id);
          const isExpanded = expandedSections.includes(section.id);
          const isActive = currentSection === section.id;
          const isLocked = section.id !== 'introduction' && 
                          !context.organizationName && 
                          !context.projectTitle && 
                          !context.call;
          
          return (
            <div key={section.id} className="border-b border-gray-200 bg-white">
              <button
                onClick={() => {
                  if (!isLocked) {
                    onSectionChange(section.id);
                    toggleSection(section.id);
                  }
                }}
                disabled={isLocked}
                className={cn(
                  "w-full px-5 py-4 flex items-center justify-between transition-all",
                  isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500" : "hover:bg-gray-50 border-l-4 border-transparent",
                  isLocked && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  {getSectionIcon(isLocked ? 'locked' : sectionData.status)}
                  <div className="text-left">
                    <h4 className={cn(
                      "font-semibold text-sm",
                      isActive ? "text-blue-900" : "text-gray-900"
                    )}>
                      {section.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {sectionData.completionPercentage > 0 && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {sectionData.completionPercentage}%
                    </span>
                  )}
                  {section.subsections && (
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  )}
                </div>
              </button>
              
              {/* Subsections */}
              {isExpanded && section.subsections && !isLocked && (
                <div className="bg-gradient-to-b from-gray-50 to-white py-2">
                  {section.subsections.map((subsection) => {
                    const isSubActive = currentSubSection === subsection.id;
                    
                    return (
                      <button
                        key={subsection.id}
                        onClick={() => onSectionChange(section.id, subsection.id)}
                        className={cn(
                          "w-full px-8 py-2 text-left flex items-center justify-between transition-colors",
                          isSubActive ? "bg-blue-100" : "hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {subsection.required && (
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" title="Pflichtfeld" />
                          )}
                          <span className={cn(
                            "text-sm",
                            isSubActive ? "text-blue-900 font-medium" : "text-gray-700"
                          )}>
                            {subsection.title}
                          </span>
                        </div>
                        
                        {subsection.wordLimit && (
                          <span className="text-xs text-gray-500">
                            {subsection.currentWords || 0}/{subsection.wordLimit}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t bg-white space-y-2">
        <button
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          onClick={() => console.log('Save draft')}
        >
          💾 Entwurf speichern
        </button>
        <button
          className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
          onClick={() => console.log('Load draft')}
        >
          📂 Entwurf laden
        </button>
      </div>
    </div>
  );
}