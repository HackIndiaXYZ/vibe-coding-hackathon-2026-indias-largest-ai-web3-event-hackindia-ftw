import { useState } from 'react'
import RepoForm from './components/RepoForm'
import TriageBoard from './components/TriageBoard'
import DuplicatesPanel from './components/DuplicatesPanel'
import ReleaseNotes from './components/ReleaseNotes'
import SqlLog from './components/SqlLog'
import RunHistory from './components/RunHistory'
import SlackInsights from './components/SlackInsights'
import LandingPage from './components/LandingPage'

const getSavedRepo = () => {
  try {
    const saved = localStorage.getItem('oss-first-mate-repo')
    return saved ? JSON.parse(saved) : { owner: 'expressjs', repo: 'express' }
  } catch {
    return { owner: 'expressjs', repo: 'express' }
  }
}

const TABS = [
  { id: 'triage', label: 'Triage', active: '#3b82f6' },
  { id: 'duplicates', label: 'Duplicates', active: '#eab308' },
  { id: 'release-notes', label: 'Release notes', active: '#22c55e' },
  { id: 'slack', label: 'Slack insights', active: '#a855f7' },
  { id: 'sql-log', label: 'SQL log', active: '#06b6d4' },
  { id: 'history', label: 'History', active: '#ec4899' },
]

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [repo, setRepo] = useState(getSavedRepo)
  const [activeTab, setActiveTab] = useState('triage')
  const [sqlLog, setSqlLog] = useState([])

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />
  }

  const activeColor = TABS.find(t => t.id === activeTab)?.active || '#3b82f6'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f3f4f6', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header bar */}
      <header style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#030712', position: 'sticky', top: 0, zIndex: 10 }}>
        
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 56 }}>
          
          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setShowLanding(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', background: 'transparent', border: '1px solid #1f2937', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#374151' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#1f2937' }}
            >
              ← Home
            </button>

            <div style={{ width: 1, height: 20, backgroundColor: '#1f2937' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 15, lineHeight: 1.2, letterSpacing: '-0.3px' }}>OSS First Mate</div>
                <div style={{ color: '#4b5563', fontSize: 11, lineHeight: 1.2 }}>AI-powered OSS maintainer assistant</div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <RepoForm repo={repo} setRepo={setRepo} />
        </div>

        {/* Tab row */}
        <div style={{ display: 'flex', padding: '0 24px', overflowX: 'auto', gap: 0 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${tab.active}` : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: isActive ? '#ffffff' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#d1d5db' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280' }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Active tab indicator bar */}
      <div style={{ height: 2, backgroundColor: activeColor, opacity: 0.15 }} />

      {/* Page content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'triage' && <TriageBoard owner={repo.owner} repo={repo.repo} onSql={q => setSqlLog(l => [...l, q])} />}
        {activeTab === 'duplicates' && <DuplicatesPanel owner={repo.owner} repo={repo.repo} onSql={q => setSqlLog(l => [...l, q])} />}
        {activeTab === 'release-notes' && <ReleaseNotes owner={repo.owner} repo={repo.repo} onSql={q => setSqlLog(l => [...l, q])} />}
        {activeTab === 'slack' && <SlackInsights owner={repo.owner} repo={repo.repo} onSql={q => setSqlLog(l => [...l, q])} />}
        {activeTab === 'sql-log' && <SqlLog queries={sqlLog} />}
        {activeTab === 'history' && <RunHistory />}
      </main>
    </div>
  )
}