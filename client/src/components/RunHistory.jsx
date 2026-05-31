import { useState, useEffect } from 'react'
import axios from 'axios'

const typeConfig = {
  triage: { color: 'text-blue-400 bg-blue-950 border-blue-900', label: 'Triage' },
  duplicates: { color: 'text-yellow-400 bg-yellow-950 border-yellow-900', label: 'Duplicates' },
  'release-notes': { color: 'text-green-400 bg-green-950 border-green-900', label: 'Release notes' },
}

export default function RunHistory() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/history')
      .then(r => setRuns(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">Run history</h2>
        <p className="text-sm text-gray-500 mt-0.5">All past agent runs stored in MongoDB Atlas</p>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4 animate-pulse h-16" />
          ))}
        </div>
      )}

      {!loading && runs.length === 0 && (
        <div className="border border-gray-800 rounded-lg p-16 text-center text-gray-600">
          No runs yet — use triage, duplicates or release notes to see history here
        </div>
      )}

      {!loading && runs.length > 0 && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Repo</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Results</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">SQL query</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(run => {
                const config = typeConfig[run.type] || { color: 'text-gray-400 bg-gray-800 border-gray-700', label: run.type }
                return (
                  <tr key={run._id} className="border-b border-gray-800/60 hover:bg-gray-900/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${config.color}`}>{config.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm font-mono">{run.repo}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{run.resultCount}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs font-mono max-w-xs">
                      <div className="truncate">{run.sqlQuery}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}