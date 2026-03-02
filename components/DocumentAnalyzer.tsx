import React, { useState } from 'react';

export default function DocumentAnalyzer() {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeDocument = async () => {
    if (!contractText.trim()) {
      setError('Please enter some contract text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_text: contractText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze document. Make sure the backend is running on port 8000.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 NestQuest Document Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Powered by Nestor AI - Analyze your rental contracts instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📝 Contract Text
            </h2>
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Paste your rental contract or lease agreement here..."
              className="w-full h-96 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none font-mono text-sm"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {contractText.length} characters
              </span>
              <button
                onClick={analyzeDocument}
                disabled={loading || !contractText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Contract'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-800">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🤖 Nestor's Analysis
            </h2>

            {!analysis && !loading && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Enter contract text and click analyze</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Confidence Score */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">Confidence Score</span>
                    <span className="text-2xl font-bold text-indigo-600">{analysis.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                      style={{ width: `${analysis.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-line text-sm">
                    {analysis.summary}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium">Words</div>
                      <div className="text-xl font-bold text-blue-900">{analysis.statistics.wordCount}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-xs text-green-600 font-medium">Paragraphs</div>
                      <div className="text-xl font-bold text-green-900">{analysis.statistics.paragraphs}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium">Amounts</div>
                      <div className="text-xl font-bold text-purple-900">{analysis.statistics.monetaryAmounts.length}</div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <div className="text-xs text-pink-600 font-medium">Dates</div>
                      <div className="text-xl font-bold text-pink-900">{analysis.statistics.dates.length}</div>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">⚠️ Issues Found</h3>
                    <div className="space-y-2">
                      {analysis.issues.map((issue, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border-2 ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-xs uppercase">{issue.severity}</span>
                            <span className="text-xs">•</span>
                            <span className="font-medium text-sm">{issue.type}</span>
                          </div>
                          <p className="text-sm mt-1">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Recommendations</h3>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sample Contract Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setContractText(`RESIDENTIAL TENANCY AGREEMENT

This Tenancy Agreement is made on 1st February 2024

BETWEEN:
Landlord: John Smith, 123 Main Street, London, UK
Tenant: Jane Doe, 456 Oak Avenue, London, UK

PROPERTY: 789 Elm Road, Apartment 2B, London, UK

1. TERM OF TENANCY
The tenancy shall commence on 1st March 2024 and continue for a fixed term of 12 months, ending on 28th February 2025.

2. RENT
The monthly rent is £1,500, payable in advance on the 1st day of each month.

3. DEPOSIT
A security deposit of £2,250 shall be paid before the tenancy begins and will be held in a government-approved tenancy deposit scheme.

4. UTILITIES
The tenant is responsible for payment of all utilities including electricity, gas, water, and internet services.

5. MAINTENANCE
The landlord shall maintain the property in good repair. The tenant must report any damages or required repairs within 48 hours.

6. TERMINATION
Either party may terminate this agreement by giving 2 months written notice before the end of the fixed term.

7. NOTICE PERIOD
For early termination during the fixed term, 3 months notice is required.

Signed:
Landlord: _________________ Date: 1/2/2024
Tenant: _________________ Date: 1/2/2024`)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            📄 Load Sample Contract
          </button>
        </div>
      </div>
    </div>
  );
}
