import Spline from '@splinetool/react-spline'
import { useRef } from 'react'

export default function LandingPage({ onStart }) {
  const hasLaunched = useRef(false)

  const handleSplineEvent = (e) => {
    if (hasLaunched.current) return
    hasLaunched.current = true
    onStart()
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#030712' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Spline
          scene="https://prod.spline.design/obU-4y-eb8Dv3wQX/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
          onSplineMouseDown={handleSplineEvent}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(3,7,18,0.15)', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', top: 36, left: 0, right: 0, zIndex: 2, pointerEvents: 'none', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '5px 18px', borderRadius: 999, border: '1px solid rgba(99,102,241,0.35)', background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', fontSize: 11, letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' }}>
          Coral SQL · Groq AI · GitHub · Slack
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, color: 'white', letterSpacing: -1, lineHeight: 1 }}>
          OSS First Mate
        </div>
        <div style={{ fontSize: 14, color: '#6b7280', marginTop: 10, letterSpacing: 0.3 }}>
          AI-powered assistant for open source maintainers
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, zIndex: 2, pointerEvents: 'none', textAlign: 'center' }}>
        <div style={{ color: '#374151', fontSize: 11, letterSpacing: 1 }}>CLICK THE PLANET TO LAUNCH</div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 130, height: 44, background: '#030712', zIndex: 3 }} />
    </div>
  )
}