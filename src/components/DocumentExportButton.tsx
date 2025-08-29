'use client';

import { useState } from 'react';
import { Download, FileText, FileCode, FilePlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TemplateContext, TemplatePopulationResult } from '@/lib/templates/template-types';

interface DocumentExportButtonProps {
  templateId?: string;
  context: Partial<TemplateContext>;
  populatedSections?: TemplatePopulationResult[];
  className?: string;
}

export function DocumentExportButton({ 
  templateId, 
  context, 
  populatedSections = [],
  className = '' 
}: DocumentExportButtonProps) {
  const { language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'word' | 'html') => {
    if (!templateId) {
      setError('No template selected');
      return;
    }

    setIsExporting(true);
    setError(null);
    setShowMenu(false);

    try {
      // Ensure context has required fields with defaults
      const fullContext: TemplateContext = {
        projectAcronym: context.projectAcronym || 'PROJECT',
        projectTitle: context.projectTitle || 'Untitled Project',
        abstract: context.abstract || '',
        keywords: context.keywords || [],
        organizationName: context.organizationName || 'Organization',
        organizationType: context.organizationType || 'Other',
        country: context.country || 'EU',
        callIdentifier: context.callIdentifier || 'HORIZON-2025',
        duration: context.duration || 36,
        totalBudget: context.totalBudget || 0,
        requestedFunding: context.requestedFunding || 0,
        consortium: context.consortium || [],
        trlStart: context.trlStart,
        trlEnd: context.trlEnd,
        ...context
      };

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          context: fullContext,
          populatedSections,
          format,
          language,
          includeAnnexes: false,
          includeToc: true,
          includeCoverPage: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Set filename based on format
      const filename = `${context.projectAcronym || 'grant-application'}.${format === 'word' ? 'docx' : format}`;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonText = () => {
    if (isExporting) {
      return language === 'de' ? 'Exportiere...' : 
             language === 'uk' ? 'Експортування...' : 
             'Exporting...';
    }
    return language === 'de' ? 'Dokument exportieren' : 
           language === 'uk' ? 'Експортувати документ' : 
           'Export Document';
  };

  if (!templateId) {
    return null; // Don't show button if no template is selected
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${className}`}
        style={{
          backgroundColor: 'rgba(48, 73, 69, 0.1)',
          color: '#304945',
          border: '1px solid rgba(48, 73, 69, 0.2)'
        }}
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.1)';
        }}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">{getButtonText()}</span>
      </button>

      {showMenu && !isExporting && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border z-50"
             style={{ borderColor: 'rgba(48, 73, 69, 0.2)', minWidth: '200px' }}>
          <div className="p-2">
            <button
              onClick={() => handleExport('word')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" style={{ color: '#304945' }} />
              <div className="text-left">
                <div className="text-sm font-medium" style={{ color: '#304945' }}>Word (DOCX)</div>
                <div className="text-xs text-gray-500">
                  {language === 'de' ? 'Bearbeitbar' : 
                   language === 'uk' ? 'Редагований' : 
                   'Editable'}
                </div>
              </div>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              <FilePlus className="w-4 h-4" style={{ color: '#304945' }} />
              <div className="text-left">
                <div className="text-sm font-medium" style={{ color: '#304945' }}>PDF</div>
                <div className="text-xs text-gray-500">
                  {language === 'de' ? 'Druckfertig' : 
                   language === 'uk' ? 'Для друку' : 
                   'Print-ready'}
                </div>
              </div>
            </button>

            <button
              onClick={() => handleExport('html')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              <FileCode className="w-4 h-4" style={{ color: '#304945' }} />
              <div className="text-left">
                <div className="text-sm font-medium" style={{ color: '#304945' }}>HTML</div>
                <div className="text-xs text-gray-500">
                  {language === 'de' ? 'Web-Format' : 
                   language === 'uk' ? 'Веб-формат' : 
                   'Web format'}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg shadow-lg z-50"
             style={{ minWidth: '200px' }}>
          {error}
        </div>
      )}
    </div>
  );
}