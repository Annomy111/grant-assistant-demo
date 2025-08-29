#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Grant Assistant - Comprehensive Test Suite\n');
console.log('================================================\n');

const tests = [
  { name: 'Landing Page', file: 'landing.test.js' },
  { name: 'Chat Interface', file: 'chat.test.js' },
  { name: 'Application Flow', file: 'application-flow.test.js' },
  { name: 'Export Functionality', file: 'export.test.js' },
  { name: 'Internationalization', file: 'i18n.test.js' },
  { name: 'API Integration', file: 'api.test.js' },
  { name: 'Responsive Design', file: 'responsive.test.js' }
];

const results = [];
let currentTest = 0;

function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n📋 Running ${test.name} Tests...`);
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    const testProcess = spawn('npx', ['jest', test.file, '--colors'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, CI: 'true', HEADLESS: 'true' }
    });
    
    let output = '';
    let errorOutput = '';
    
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });
    
    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });
    
    testProcess.on('close', (code) => {
      const duration = Date.now() - startTime;
      const passed = code === 0;
      
      results.push({
        name: test.name,
        file: test.file,
        passed,
        duration,
        output: output + errorOutput
      });
      
      console.log(`\n${passed ? '✅' : '❌'} ${test.name} Tests: ${passed ? 'PASSED' : 'FAILED'} (${duration}ms)\n`);
      resolve();
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting test execution...\n');
  console.log(`Testing URL: ${process.env.TEST_URL || 'http://localhost:3000'}`);
  console.log(`Total test suites: ${tests.length}\n`);
  
  for (const test of tests) {
    await runTest(test);
  }
  
  generateReport();
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  // Summary table
  console.log('Test Suite Results:');
  console.log('-'.repeat(60));
  results.forEach(r => {
    const status = r.passed ? '✅ PASS' : '❌ FAIL';
    const time = `${(r.duration / 1000).toFixed(2)}s`;
    console.log(`${status.padEnd(10)} | ${r.name.padEnd(25)} | ${time}`);
  });
  console.log('-'.repeat(60));
  
  // Overall statistics
  console.log('\nOverall Statistics:');
  console.log(`• Total Suites: ${tests.length}`);
  console.log(`• Passed: ${passed} (${((passed/tests.length)*100).toFixed(1)}%)`);
  console.log(`• Failed: ${failed} (${((failed/tests.length)*100).toFixed(1)}%)`);
  console.log(`• Total Time: ${(totalDuration / 1000).toFixed(2)}s`);
  
  // Generate HTML report
  generateHTMLReport(results);
  
  // Exit code
  process.exit(failed > 0 ? 1 : 0);
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grant Assistant - Test Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat {
      background: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #3b82f6;
    }
    .stat-label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .test-results {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #3b82f6;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    .pass {
      color: #10b981;
      font-weight: bold;
    }
    .fail {
      color: #ef4444;
      font-weight: bold;
    }
    .timestamp {
      color: #666;
      font-size: 0.9em;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>🧪 Grant Assistant - Test Report</h1>
  
  <div class="summary">
    <h2>Test Execution Summary</h2>
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${results.length}</div>
        <div class="stat-label">Total Suites</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.filter(r => r.passed).length}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.filter(r => !r.passed).length}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat">
        <div class="stat-value">${(results.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2)}s</div>
        <div class="stat-label">Total Time</div>
      </div>
    </div>
  </div>
  
  <div class="test-results">
    <table>
      <thead>
        <tr>
          <th>Test Suite</th>
          <th>Status</th>
          <th>Duration</th>
          <th>File</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
        <tr>
          <td><strong>${r.name}</strong></td>
          <td class="${r.passed ? 'pass' : 'fail'}">${r.passed ? '✅ PASS' : '❌ FAIL'}</td>
          <td>${(r.duration / 1000).toFixed(2)}s</td>
          <td><code>${r.file}</code></td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
</body>
</html>
  `;
  
  const reportPath = path.join(__dirname, '..', 'test-report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`\n📄 HTML Report generated: ${reportPath}`);
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };