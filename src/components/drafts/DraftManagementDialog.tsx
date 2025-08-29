'use client';

import { useState, useRef } from 'react';
import { 
  X, Save, Download, Upload, Trash2, Clock, 
  FileText, AlertCircle, Check 
} from 'lucide-react';
import { useDraftManager } from '@/hooks/useDraftManager';
import { Draft } from '@/lib/drafts/DraftManager';

interface DraftManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDraft: (draft: Draft) => void;
  currentMessages?: any[];
  currentPopulatedSections?: any[];
}

export function DraftManagementDialog({
  isOpen,
  onClose,
  onLoadDraft,
  currentMessages,
  currentPopulatedSections
}: DraftManagementDialogProps) {
  const {
    drafts,
    currentDraftId,
    autoSaveEnabled,
    lastSaved,
    saveDraft,
    loadDraft,
    deleteDraft,
    exportDraft,
    importDraft,
    clearAllDrafts,
    toggleAutoSave,
    getDraftStats
  } = useDraftManager();
  
  const [saveName, setSaveName] = useState('');
  const [selectedDraftId, setSelectedDraftId] = useState<string | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const stats = getDraftStats();
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const name = saveName || `Entwurf - ${new Date().toLocaleString('de-DE')}`;
    const draft = saveDraft(name, currentMessages, currentPopulatedSections);
    setSaveName('');
    
    // Show success feedback
    const successEl = document.getElementById('save-success');
    if (successEl) {
      successEl.classList.remove('hidden');
      setTimeout(() => successEl.classList.add('hidden'), 2000);
    }
  };
  
  const handleLoad = (draftId: string) => {
    const draft = loadDraft(draftId);
    if (draft) {
      onLoadDraft(draft);
      onClose();
    }
  };
  
  const handleDelete = (draftId: string) => {
    if (deleteDraft(draftId)) {
      setShowDeleteConfirm(undefined);
      if (selectedDraftId === draftId) {
        setSelectedDraftId(undefined);
      }
    }
  };
  
  const handleExport = (draftId: string) => {
    exportDraft(draftId);
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const importedDraft = await importDraft(file);
      if (importedDraft) {
        // Show success feedback
        const successEl = document.getElementById('import-success');
        if (successEl) {
          successEl.classList.remove('hidden');
          setTimeout(() => successEl.classList.add('hidden'), 2000);
        }
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Entwurfsverwaltung</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Stats Bar */}
        <div className="px-6 py-3 bg-blue-50 border-b">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{stats.totalDrafts}</span> Entwürfe
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                Durchschnitt: <span className="font-medium">{stats.averageCompletion}%</span>
              </span>
              {lastSaved && (
                <span className="flex items-center gap-1 text-green-700">
                  <Check className="w-4 h-4" />
                  Zuletzt gespeichert: {formatDate(lastSaved)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => toggleAutoSave(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-Speichern</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Entwurfsname eingeben..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importieren
            </button>
            
            {drafts.length > 0 && (
              <button
                onClick={clearAllDrafts}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Alle Entwürfe löschen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Success Messages */}
          <div id="save-success" className="hidden mt-2 text-sm text-green-700 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Entwurf erfolgreich gespeichert!
          </div>
          <div id="import-success" className="hidden mt-2 text-sm text-green-700 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Entwurf erfolgreich importiert!
          </div>
        </div>
        
        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {drafts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Keine gespeicherten Entwürfe vorhanden</p>
              <p className="text-sm mt-1">Speichern Sie Ihren ersten Entwurf mit dem Button oben</p>
            </div>
          ) : (
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    selectedDraftId === draft.id ? 'border-blue-500 bg-blue-50' : ''
                  } ${currentDraftId === draft.id ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedDraftId(draft.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{draft.name}</h4>
                        {currentDraftId === draft.id && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Aktuell
                          </span>
                        )}
                        {draft.autoSave && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Auto-Save
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <p>
                          Projekt: <span className="font-medium">
                            {draft.context.projectTitle || 'Unbenannt'}
                          </span>
                        </p>
                        <p>
                          Organisation: <span className="font-medium">
                            {draft.context.organizationName || 'Nicht angegeben'}
                          </span>
                        </p>
                        {draft.metadata?.completionPercentage !== undefined && (
                          <p>
                            Fortschritt: <span className="font-medium">
                              {draft.metadata.completionPercentage}%
                            </span>
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>Version {draft.version}</span>
                        <span>Erstellt: {formatDate(draft.createdAt)}</span>
                        <span>Aktualisiert: {formatDate(draft.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoad(draft.id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Entwurf laden"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(draft.id);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Exportieren"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(draft.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {showDeleteConfirm === draft.id && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Möchten Sie diesen Entwurf wirklich löschen?
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(draft.id);
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Löschen
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(undefined);
                          }}
                          className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}