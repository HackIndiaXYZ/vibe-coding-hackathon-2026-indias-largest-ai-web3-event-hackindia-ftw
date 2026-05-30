import { useState } from 'react'
import axios from 'axios'

const relevanceColor = {
  high: 'bg-green-900 text-green-300',
  medium: 'bg-yellow-900 text-yellow-300',
  low: 'bg-gray-700 text-gray-300',
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 bg-gray-700 rounded-full"/>
        <div className="h-5 w-16 bg-gray-700 rounded-full"/>
      </div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"/>
      <div className="h-3 bg-gray-800 rounded w-full mb-1"/>
      <div className="h-3 bg-gray-800 rounded w-2/3"/>
    </div>
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
          <h2 className="text-lg font-medium">Slack insights</h2>
          <p className="text-sm text-gray-400">Match GitHub issues with Slack discussions — cross-source join</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 text-sm">#</span>
          <input
            value={channel}
            onChange={e => setChannel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white w-36 focus:outline-none focus:border-blue-500"
            placeholder="channel-name"
          />
          <button
            onClick={run}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {loading ? 'Analyzing...' : 'Find links'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded p-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && linked.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <p>Click "Find links" to match GitHub issues with Slack discussions</p>
          <p className="text-xs mt-2">Make sure your bot is invited to #{channel}</p>
        </div>
      )}

      <div className="grid gap-3">
        {loading
          ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : linked.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-sm font-mono">#{item.issueNumber}</span>
                <span className="text-white text-sm">{item.issueTitle}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${relevanceColor[item.relevance]}`}>
                  {item.relevance}
                </span>
              </div>
              <div className="bg-gray-800 rounded p-3 mb-2">
                <p className="text-xs text-gray-400 mb-1">Slack message</p>
                <p className="text-sm text-gray-200">"{item.slackMessage}"</p>
              </div>
              <p className="text-xs text-gray-500">{item.reason}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}