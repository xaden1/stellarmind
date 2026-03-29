import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHorizon } from '../hooks/useHorizon';
import { useAI } from '../hooks/useAI';
import { truncateAddress, formatDate, getScoreColor, getScoreLabel } from '../utils/formatters';

export default function Report({ walletAddress }) {
  const navigate = useNavigate();
  const { walletData, fetchWalletData } = useHorizon();
  const { analysis, getReport } = useAI();
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let data = walletData;
      if (!data) data = await fetchWalletData(walletAddress);
      if (!data) { setGenerating(false); return; }
      const r = await getReport(data);
      setReport(r);
    } catch (e) {
      console.error('Report generation failed:', e);
      toast.error(e.message || 'Failed to generate report. Check your API key.');
    } finally {
      setGenerating(false);
    }
  };

  const scoreColor = getScoreColor(analysis?.healthScore || 0);
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      {/* Print controls */}
      <div className="no-print max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-3">
          {!report && (
            <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : '✦'}
              {generating ? 'Generating...' : 'Generate AI Report'}
            </button>
          )}
          {report && (
            <button onClick={() => window.print()} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          )}
        </div>
      </div>

      {/* Report area */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="card p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold font-display"
                  style={{ background: 'linear-gradient(135deg, var(--purple), var(--teal))' }}
                >
                  SM
                </div>
                <span className="font-display font-bold text-white text-lg">StellarMind</span>
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Monthly Financial Report</p>
            </div>
            <div className="text-right">
              <p style={{ color: 'var(--text-2)', fontSize: 13 }}>{report?.period || today}</p>
              <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-3)' }}>{truncateAddress(walletAddress, 8)}</p>
            </div>
          </div>

          {/* Grade + Score */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              {report?.grade && (
                <>
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl text-white mb-2"
                    style={{ background: `${scoreColor}20`, border: `2px solid ${scoreColor}`, color: scoreColor }}
                  >
                    {report.grade}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Overall Grade</span>
                </>
              )}
            </div>
            {analysis && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display font-bold text-white text-4xl" style={{ color: scoreColor }}>{analysis.healthScore}</span>
                  <div>
                    <p className="font-medium text-white">{getScoreLabel(analysis.healthScore)}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Health Score out of 100</p>
                  </div>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${analysis.healthScore}%`, background: `linear-gradient(90deg, var(--purple), ${scoreColor})` }} />
                </div>
              </div>
            )}
            {analysis?.personality && (
              <div className="text-center">
                <div className="text-4xl mb-1">{analysis.personality.emoji}</div>
                <p className="font-display font-bold text-white text-sm">{analysis.personality.archetype}</p>
              </div>
            )}
          </div>

          {/* No report yet */}
          {!report && !generating && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📊</p>
              <h3 className="font-display font-bold text-white mb-2">Ready to generate your report?</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
                Claude AI will write a customized financial wellness report based on your on-chain behavior.
              </p>
              <button onClick={handleGenerate} className="btn-primary">Generate AI Report</button>
            </div>
          )}

          {generating && (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: 'var(--purple)' }} />
              <p style={{ color: 'var(--text-2)' }}>Claude is writing your report...</p>
            </div>
          )}

          {report && (
            <>
              {/* Summary */}
              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-lg mb-3">Executive Summary</h2>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{report.summary}</p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-lg mb-3">✦ Highlights</h2>
                <ul className="space-y-2">
                  {report.highlights?.map((h, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: 'var(--text-2)', fontSize: 14 }}>
                      <span style={{ color: 'var(--teal)', flexShrink: 0 }}>✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-lg mb-3">→ Recommendations</h2>
                <ul className="space-y-2">
                  {report.recommendations?.map((r, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: 'var(--text-2)', fontSize: 14 }}>
                      <span style={{ color: 'var(--purple)', flexShrink: 0 }}>→</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outlook */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h2 className="font-display font-bold text-white text-base mb-2">Outlook</h2>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{report.outlook}</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Generated by StellarMind • {today}</p>
            <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Stellar Testnet Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
