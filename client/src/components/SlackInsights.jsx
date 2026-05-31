import { useState } from 'react'
import axios from 'axios'

const relevanceColor = {
  high: 'text-green-400 bg-green-950 border-green-900',
  medium: 'text-yellow-400 bg-yellow-950 border-yellow-900',
  low: 'text-gray-400 bg-gray-800 border-gray-700',
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800 animate-pulse">
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-4 w-48 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-4 w-56 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-800 rounded-full"/></td>
      <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-800 rounded"/></td>
    </tr>
  )
}

export default function SlackInsights({ owner, repo, onSql }) {
  const [linked, setLinked] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [channel, setChannel] = useState('github-issues')

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('/api/slack', { owner, repo, channel }, { timeout: 60000 })
      setLinked(data.linked)
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
          <h2 className="text-lg font-medium text-white">Slack insights</h2>
          <p className="text-sm text-gray-500 mt-0.5">Match GitHub issues with Slack discussions — cross-source join via Coral SQL</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-3 py-1.5 gap-1">
            <span className="text-gray-500 text-sm">#</span>
            <input
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className="bg-transparent text-sm text-white w-32 focus:outline-none"
              placeholder="channel-name"
            />
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {loading ? 'Analyzing...' : 'Find links'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-950 border border-red-900 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}

      {!loading && linked.length === 0 && (
        <div className="border border-gray-800 rounded-lg p-16 text-center text-gray-600">
          <p>Click "Find links" to match GitHub issues with Slack discussions</p>
          <p className="text-xs mt-2 text-gray-700">Make sure your bot is invited to #{channel}</p>
        </div>
      )}

      {(loading || linked.length > 0) && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">GitHub issue</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Slack message</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Relevance</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : linked.map((item, i) => (
                  <tr key={i} className="border-b border-gray-800/60 hover:bg-gray-900/60 transition-colors">
                    <td className="px-4 py-3 text-blue-400 text-sm font-mono">#{item.issueNumber}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm max-w-xs">
                      <div className="truncate">{item.issueTitle}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm max-w-xs">
                      <div className="truncate italic">"{item.slackMessage}"</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${relevanceColor[item.relevance]}`}>
                        {item.relevance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.reason}</td>
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