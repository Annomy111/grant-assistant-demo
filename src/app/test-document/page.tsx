'use client';

import { useState } from 'react';
import { DocumentExportButton } from '@/components/DocumentExportButton';
import { TemplateContext, TemplatePopulationResult } from '@/lib/templates/template-types';

export default function TestDocumentPage() {
  // Test context for Ukraine-specific template
  const testContext: TemplateContext = {
    projectAcronym: 'SAFE-UA-2025',
    projectTitle: 'Supporting Ukrainian Children Affected by War - SafeSpaces Initiative',
    abstract: 'This project aims to provide comprehensive psychosocial support and protection services to Ukrainian refugee children in Germany and Poland, focusing on trauma-informed care, educational continuity, and family strengthening.',
    keywords: ['child protection', 'Ukraine', 'refugees', 'psychosocial support', 'education', 'integration'],
    organizationName: 'German-Ukrainian Bureau for Civil Society',
    organizationType: 'NGO',
    country: 'DE',
    callIdentifier: 'CERV-2025-CHILD',
    duration: 24,
    totalBudget: 750000,
    requestedFunding: 675000, // 90% funding rate
    consortium: [
      {
        name: 'German-Ukrainian Bureau for Civil Society',
        country: 'DE',
        type: 'NGO',
        role: 'Coordinator'
      },
      {
        name: 'Ukrainian Child Protection Foundation',
        country: 'UA',
        type: 'NGO',
        role: 'Partner'
      },
      {
        name: 'Polish Migration Forum',
        country: 'PL',
        type: 'NGO',
        role: 'Partner'
      }
    ]
  };

  // Sample populated sections
  const testPopulatedSections: TemplatePopulationResult[] = [
    {
      sectionId: 'relevance',
      subsectionId: 'priorities',
      content: `## 1.1 Alignment with Call Priorities

### Primary Priority Addressed
This project directly addresses the priority: "Protection and support for children affected by war, including Ukrainian refugees and displaced children"

### Specific Objectives
Our project will:
1. **Child Protection Systems**: Strengthen child protection mechanisms for 2,500 Ukrainian refugee children in Germany and Poland
2. **Psychosocial Support**: Provide trauma-informed care to 1,800 Ukrainian children affected by war
3. **Education Continuity**: Ensure access to education and learning opportunities for all beneficiaries
4. **Family Support**: Strengthen family-based care and prevent separation
5. **Integration Support**: Facilitate integration while preserving cultural identity

### Target Groups
- Ukrainian refugee and displaced children (ages 0-18): 2,500 direct beneficiaries
- Children remaining in Ukraine in conflict-affected areas: 500 via online support
- Host community children to promote integration: 1,000
- Parents, caregivers, and child protection professionals: 300

### Geographic Coverage
- EU Member States: Germany (Berlin, Munich), Poland (Warsaw, Krakow)
- Ukraine: Kyiv, Lviv, Kharkiv regions (where security permits)
- Online/remote support for wider reach across all territories`,
      fields: {
        target_children_number: 2500
      },
      completeness: 95,
      missingRequirements: []
    }
  ];

  const [selectedTemplateId] = useState('cerv-child-2025'); // Ukraine CERV template

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#304945' }}>
          Document Generation Test
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#304945' }}>
            Test Project Context
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Project:</span> {testContext.projectTitle}
            </div>
            <div>
              <span className="font-medium">Acronym:</span> {testContext.projectAcronym}
            </div>
            <div>
              <span className="font-medium">Organization:</span> {testContext.organizationName}
            </div>
            <div>
              <span className="font-medium">Call:</span> {testContext.callIdentifier}
            </div>
            <div>
              <span className="font-medium">Budget:</span> €{testContext.totalBudget.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {testContext.duration} months
            </div>
            <div className="col-span-2">
              <span className="font-medium">Partners:</span>
              <ul className="mt-2 space-y-1">
                {testContext.consortium.map((partner, idx) => (
                  <li key={idx} className="ml-4">
                    • {partner.name} ({partner.country}) - {partner.role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#304945' }}>
            Template Information
          </h2>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Template ID:</span> {selectedTemplateId}
            </div>
            <div>
              <span className="font-medium">Program:</span> CERV - Citizens, Equality, Rights and Values
            </div>
            <div>
              <span className="font-medium">Call:</span> CERV-2025-CHILD - Rights of the Child (Ukraine Focus)
            </div>
            <div>
              <span className="font-medium">Deadline:</span> 29 April 2025, 17:00 CET
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#304945' }}>
            Generate Document
          </h2>
          
          <p className="text-gray-600 mb-6">
            Click the button below to generate a complete grant application document using the test data and template.
            The document will include all sections, proper formatting, and can be exported in multiple formats.
          </p>

          <div className="flex justify-center">
            <DocumentExportButton
              templateId={selectedTemplateId}
              context={testContext}
              populatedSections={testPopulatedSections}
              className="px-6 py-3"
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">ℹ️ Test Information</h3>
          <p className="text-sm text-blue-800">
            This test page demonstrates the document generation functionality with a real Ukraine-specific template
            (CERV-2025-CHILD). The generated document will include cover page, table of contents, and all template
            sections with sample content.
          </p>
        </div>
      </div>
    </div>
  );
}