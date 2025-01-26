import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Newspaper, Send } from 'lucide-react';

function App() {
  const [newsText, setNewsText] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newsText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze news');
      }

      const data = await response.json();
      setResult(data.is_authentic);
    } catch (err) {
      setError('Failed to analyze news. Please try again.');
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Newspaper className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fake News Detector</h1>
            <p className="text-lg text-gray-600">
              Enter any news article to check its authenticity
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="newsText" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  News Text
                </label>
                <textarea
                  id="newsText"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="Paste your news article here..."
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !newsText.trim()}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium
                  ${isAnalyzing || !newsText.trim() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
                  }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Analyze News
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg p-6 bg-red-50 border border-red-200 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result !== null && !isAnalyzing && (
            <div className={`rounded-lg p-6 ${
              result ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {result ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                )}
                <div className="ml-3">
                  <h3 className={`text-lg font-semibold ${
                    result ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result ? 'Likely Authentic News' : 'Potential Fake News Detected'}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    result ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result 
                      ? 'Our analysis suggests this news article is likely to be authentic.' 
                      : 'Our analysis indicates this news article might contain misleading information.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;