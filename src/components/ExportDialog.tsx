'use client';

import { useState } from 'react';
import { Download, FileText, X } from 'lucide-react';
import { documentGenerator } from '@/lib/export/document-generator';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationData: any;
}

export function ExportDialog({ isOpen, onClose, applicationData }: ExportDialogProps) {
  const { language, t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleExport = async (format: 'pdf' | 'word') => {
    setIsExporting(true);
    
    try {
      let blob: Blob;
      let filename: string;
      
      if (format === 'pdf') {
        blob = await documentGenerator.exportToPDF(applicationData, language);
        filename = `${applicationData.projectTitle || 'grant-application'}.pdf`;
      } else {
        blob = await documentGenerator.exportToWord(applicationData, language);
        filename = `${applicationData.projectTitle || 'grant-application'}.docx`;
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ color: '#304945' }}>
            {language === 'de' ? 'Dokument exportieren' : 
             language === 'uk' ? 'Експортувати документ' : 
             'Export Document'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <X className="w-5 h-5" style={{ color: '#304945' }} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          {language === 'de' ? 'Wählen Sie das gewünschte Format für den Export:' : 
           language === 'uk' ? 'Виберіть бажаний формат для експорту:' : 
           'Choose your preferred export format:'}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors disabled:opacity-50"
            style={{ borderColor: 'rgba(48, 73, 69, 0.2)' }}
            onMouseEnter={(e) => { if (!isExporting) e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: 'rgba(48, 73, 69, 0.8)' }} />
              <div className="text-left">
                <p className="font-medium" style={{ color: '#304945' }}>PDF</p>
                <p className="text-sm text-gray-500">
                  {language === 'de' ? 'Für Druck und Archivierung' : 
                   language === 'uk' ? 'Для друку та архівування' : 
                   'For printing and archiving'}
                </p>
              </div>
            </div>
            <Download className="w-5 h-5" style={{ color: 'rgba(48, 73, 69, 0.5)' }} />
          </button>
          
          <button
            onClick={() => handleExport('word')}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 border rounded-lg transition-colors disabled:opacity-50"
            style={{ borderColor: 'rgba(48, 73, 69, 0.2)' }}
            onMouseEnter={(e) => { if (!isExporting) e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: '#304945' }} />
              <div className="text-left">
                <p className="font-medium" style={{ color: '#304945' }}>Word (DOCX)</p>
                <p className="text-sm text-gray-500">
                  {language === 'de' ? 'Für weitere Bearbeitung' : 
                   language === 'uk' ? 'Для подальшого редагування' : 
                   'For further editing'}
                </p>
              </div>
            </div>
            <Download className="w-5 h-5" style={{ color: 'rgba(48, 73, 69, 0.5)' }} />
          </button>
        </div>
        
        {isExporting && (
          <div className="mt-4 text-center text-gray-600">
            {language === 'de' ? 'Exportiere...' : 
             language === 'uk' ? 'Експортування...' : 
             'Exporting...'}
          </div>
        )}
      </div>
    </div>
  );
}