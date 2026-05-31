export default function SqlLog({ queries }) {
  if (queries.length === 0) {
    return (
      <div className="border border-gray-800 rounded-lg p-16 text-center text-gray-600">
        SQL queries will appear here as you use triage, duplicates, and Slack insights
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">SQL log</h2>
        <p className="text-sm text-gray-500 mt-0.5">Every query Coral ran against GitHub — no glue code</p>
      </div>
      <div className="space-y-3">
        {queries.map((q, i) => (
          <div key={i} className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs text-cyan-400 font-mono font-medium">Query #{i + 1}</span>
              <span className="text-xs text-gray-600">via Coral SQL</span>
            </div>
            <div className="p-4 bg-gray-950">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{q}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}