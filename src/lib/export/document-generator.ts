interface ApplicationData {
  organizationName: string;
  projectTitle: string;
  projectAcronym?: string;
  country: string;
  sections: {
    excellence?: string;
    impact?: string;
    implementation?: string;
  };
  budget?: {
    total: number;
    partners?: Array<{ name: string; budget: number }>;
  };
  workPackages?: Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
  }>;
}

export class DocumentGenerator {
  generateHTML(data: ApplicationData, language: string = 'de'): string {
    const title = language === 'de' ? 'EU Horizon Europe Antrag' : 
                  language === 'uk' ? 'Заявка EU Horizon Europe' : 
                  'EU Horizon Europe Application';
    
    const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
        }
        h1 {
            color: #003399;
            border-bottom: 3px solid #FFD617;
            padding-bottom: 10px;
        }
        h2 {
            color: #003399;
            margin-top: 30px;
        }
        h3 {
            color: #555;
            margin-top: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .eu-flag {
            width: 60px;
            height: 40px;
            background: linear-gradient(to bottom, 
                #003399 0%, #003399 8.33%,
                #FFD617 8.33%, #FFD617 16.66%,
                #003399 16.66%, #003399 25%,
                #FFD617 25%, #FFD617 33.33%,
                #003399 33.33%, #003399 41.66%,
                #FFD617 41.66%, #FFD617 50%,
                #003399 50%, #003399 58.33%,
                #FFD617 58.33%, #FFD617 66.66%,
                #003399 66.66%, #003399 75%,
                #FFD617 75%, #FFD617 83.33%,
                #003399 83.33%, #003399 91.66%,
                #FFD617 91.66%, #FFD617 100%
            );
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .metadata {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .metadata table {
            width: 100%;
        }
        .metadata td {
            padding: 5px 0;
        }
        .metadata td:first-child {
            font-weight: bold;
            width: 30%;
        }
        .work-package {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        .budget-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .budget-table th,
        .budget-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .budget-table th {
            background-color: #f5f5f5;
        }
        @media print {
            body {
                padding: 15mm;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="eu-flag"></div>
    </div>
    
    <div class="metadata">
        <table>
            <tr>
                <td>${language === 'de' ? 'Organisation:' : language === 'uk' ? 'Організація:' : 'Organization:'}</td>
                <td>${data.organizationName}</td>
            </tr>
            <tr>
                <td>${language === 'de' ? 'Projekttitel:' : language === 'uk' ? 'Назва проекту:' : 'Project Title:'}</td>
                <td>${data.projectTitle}</td>
            </tr>
            ${data.projectAcronym ? `
            <tr>
                <td>${language === 'de' ? 'Akronym:' : language === 'uk' ? 'Акронім:' : 'Acronym:'}</td>
                <td>${data.projectAcronym}</td>
            </tr>
            ` : ''}
            <tr>
                <td>${language === 'de' ? 'Land:' : language === 'uk' ? 'Країна:' : 'Country:'}</td>
                <td>${data.country === 'DE' ? 'Deutschland' : data.country === 'UA' ? 'Україна' : data.country}</td>
            </tr>
        </table>
    </div>
    
    ${data.sections.excellence ? `
    <div class="section">
        <h2>1. Excellence</h2>
        <div>${data.sections.excellence.replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
    
    ${data.sections.impact ? `
    <div class="section">
        <h2>2. Impact</h2>
        <div>${data.sections.impact.replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
    
    ${data.sections.implementation ? `
    <div class="section">
        <h2>3. Implementation</h2>
        <div>${data.sections.implementation.replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
    
    ${data.workPackages && data.workPackages.length > 0 ? `
    <div class="section">
        <h2>${language === 'de' ? 'Arbeitspakete' : language === 'uk' ? 'Робочі пакети' : 'Work Packages'}</h2>
        ${data.workPackages.map(wp => `
        <div class="work-package">
            <h3>${wp.id}: ${wp.title}</h3>
            <p>${wp.description}</p>
            <p><strong>${language === 'de' ? 'Dauer:' : language === 'uk' ? 'Тривалість:' : 'Duration:'}</strong> ${wp.duration} ${language === 'de' ? 'Monate' : language === 'uk' ? 'місяців' : 'months'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${data.budget ? `
    <div class="section">
        <h2>${language === 'de' ? 'Budget' : language === 'uk' ? 'Бюджет' : 'Budget'}</h2>
        <table class="budget-table">
            <thead>
                <tr>
                    <th>${language === 'de' ? 'Partner' : language === 'uk' ? 'Партнер' : 'Partner'}</th>
                    <th>${language === 'de' ? 'Budget (EUR)' : language === 'uk' ? 'Бюджет (EUR)' : 'Budget (EUR)'}</th>
                </tr>
            </thead>
            <tbody>
                ${data.budget.partners ? data.budget.partners.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.budget.toLocaleString('de-DE')} €</td>
                </tr>
                `).join('') : ''}
                <tr style="font-weight: bold;">
                    <td>${language === 'de' ? 'Gesamt' : language === 'uk' ? 'Всього' : 'Total'}</td>
                    <td>${data.budget.total.toLocaleString('de-DE')} €</td>
                </tr>
            </tbody>
        </table>
    </div>
    ` : ''}
    
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        <p>${language === 'de' ? 'Erstellt mit KI-Antragsassistent' : language === 'uk' ? 'Створено за допомогою ШІ-асистента' : 'Created with AI Grant Assistant'}</p>
        <p>${new Date().toLocaleDateString(language === 'de' ? 'de-DE' : language === 'uk' ? 'uk-UA' : 'en-US')}</p>
    </div>
</body>
</html>
    `;
    
    return html;
  }
  
  async exportToPDF(data: ApplicationData, language: string = 'de'): Promise<Blob> {
    const html = this.generateHTML(data, language);
    
    // In production, you would use a PDF generation service or library
    // For now, we'll return the HTML as a blob
    const blob = new Blob([html], { type: 'text/html' });
    return blob;
  }
  
  async exportToWord(data: ApplicationData, language: string = 'de'): Promise<Blob> {
    const html = this.generateHTML(data, language);
    
    // Create a simplified Word document format (HTML with Word-specific headers)
    const wordDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${data.projectTitle}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
      </head>
      ${html.replace('<html', '<body').replace('</html>', '</body>')}
      </html>
    `;
    
    const blob = new Blob([wordDoc], { 
      type: 'application/vnd.ms-word' 
    });
    
    return blob;
  }
}

export const documentGenerator = new DocumentGenerator();