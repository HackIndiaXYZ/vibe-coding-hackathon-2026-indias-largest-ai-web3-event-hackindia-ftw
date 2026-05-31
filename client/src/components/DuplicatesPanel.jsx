import { useState } from 'react'
import { findDuplicates } from '../api'

const confidenceColor = {
  high: 'text-red-400 bg-red-950 border-red-900',
  medium: 'text-yellow-400 bg-yellow-950 border-yellow-900',
  low: 'text-gray-400 bg-gray-800 border-gray-700',
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800 animate-pulse">
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-800 rounded-full"/></td>
      <td className="px-4 py-3"><div className="h-4 w-64 bg-gray-800 rounded"/></td>
    </tr>
  )
}

export default function DuplicatesPanel({ owner, repo, onSql }) {
  const [duplicates, setDuplicates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await findDuplicates(owner, repo)
      setDuplicates(data.duplicates)
      setTotal(data.total)
      onSql(data.sqlQuery)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-white">Duplicate detection</h2>
          <p className="text-sm text-gray-500 mt-0.5">Find issues that describe the same problem</p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          {loading ? 'Scanning...' : 'Find duplicates'}
        </button>
      </div>

      {error && <div className="bg-red-950 border border-red-900 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}

      {!loading && duplicates.length === 0 && (
        <div className="border border-gray-800 rounded-lg p-16 text-center text-gray-600">
          Click "Find duplicates" to scan open issues
        </div>
      )}

      {!loading && duplicates.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-400">Found <span className="text-white font-medium">{duplicates.length}</span> duplicate pairs from {total} open issues</span>
        </div>
      )}

      {(loading || duplicates.length > 0) && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Issue 1</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Issue 2</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Confidence</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : duplicates.map((d, i) => (
                  <tr key={i} className="border-b border-gray-800/60 hover:bg-gray-900/60 transition-colors">
                    <td className="px-4 py-3 text-blue-400 text-sm font-mono">#{d.issue1}</td>
                    <td className="px-4 py-3 text-blue-400 text-sm font-mono">#{d.issue2}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${confidenceColor[d.confidence]}`}>
                        {d.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{d.reason}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}