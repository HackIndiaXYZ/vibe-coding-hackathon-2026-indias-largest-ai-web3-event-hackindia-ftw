import { useState } from 'react'
import { triageIssues } from '../api'
import axios from 'axios'

const priorityColor = {
  high: 'text-red-400 bg-red-950 border-red-900',
  medium: 'text-yellow-400 bg-yellow-950 border-yellow-900',
  low: 'text-green-400 bg-green-950 border-green-900',
}

const typeColor = {
  bug: 'text-red-300 bg-red-900/40',
  feature: 'text-blue-300 bg-blue-900/40',
  docs: 'text-purple-300 bg-purple-900/40',
  question: 'text-orange-300 bg-orange-900/40',
  other: 'text-gray-300 bg-gray-800',
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800 animate-pulse">
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-4 w-48 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-800 rounded-full"/></td>
      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-800 rounded-full"/></td>
      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-800 rounded"/></td>
      <td className="px-4 py-3"><div className="h-7 w-24 bg-gray-800 rounded"/></td>
    </tr>
  )
}

function IssueRow({ issue, owner, repo }) {
  const [resolved, setResolved] = useState(false)
  const [resolving, setResolving] = useState(false)

  const markResolved = async () => {
    setResolving(true)
    try {
      await axios.post('/api/slack/resolve', {
        issueNumber: issue.number,
        issueTitle: issue.summary,
        resolvedBy: `${owner}/${repo} maintainer`,
        channel: 'github-issues'
      })
      setResolved(true)
    } catch (e) {
      console.error(e)
    } finally {
      setResolving(false)
    }
  }

  return (
    <tr className={`border-b border-gray-800/60 hover:bg-gray-900/60 transition-colors ${resolved ? 'opacity-40' : ''}`}>
      <td className="px-4 py-3 text-gray-500 text-sm font-mono">#{issue.number}</td>
      <td className="px-4 py-3 text-gray-200 text-sm max-w-xs">
        <div className="truncate">{issue.summary}</div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded-full ${typeColor[issue.type] || typeColor.other}`}>
          {issue.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded border ${priorityColor[issue.priority]}`}>
          {issue.priority}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{issue.suggestedLabel}</td>
      <td className="px-4 py-3">
        {resolved ? (
          <span className="text-green-400 text-xs">✓ Slack notified</span>
        ) : (
          <button
            onClick={markResolved}
            disabled={resolving}
            className="text-xs bg-gray-800 hover:bg-green-900 border border-gray-700 hover:border-green-700 text-gray-300 hover:text-green-300 px-3 py-1.5 rounded transition-all disabled:opacity-50"
          >
            {resolving ? 'Notifying...' : 'Mark resolved'}
          </button>
        )}
      </td>
    </tr>
  )
}

export default function TriageBoard({ owner, repo, onSql }) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await triageIssues(owner, repo)
      setIssues(data.issues)
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
          <h2 className="text-lg font-medium text-white">Issue triage</h2>
          <p className="text-sm text-gray-500 mt-0.5">Classify and prioritize open issues using AI</p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          {loading ? 'Analyzing...' : 'Run triage'}
        </button>
      </div>

      {error && <div className="bg-red-950 border border-red-900 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}

      {!loading && issues.length === 0 && (
        <div className="border border-gray-800 rounded-lg p-16 text-center text-gray-600">
          Click "Run triage" to analyze open issues
        </div>
      )}

      {(loading || issues.length > 0) && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Issue</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Label</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : issues.map(issue => (
                  <IssueRow key={issue.number} issue={issue} owner={owner} repo={repo} />
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}