// Shared layout wrapper for all questionnaire forms
export default function FormShell({ patient, title, step, totalSteps, onBack, children }) {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: '#1e40af',
        color: '#fff',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: 16,
          cursor: 'pointer',
          flexShrink: 0,
        }}>← 戻る</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            {patient.name}（{patient.age}歳）
          </div>
          <div style={{ fontSize: 17, fontWeight: 'bold', marginTop: 2 }}>{title}</div>
        </div>
        {totalSteps && (
          <div style={{ fontSize: 13, opacity: 0.8, flexShrink: 0 }}>
            {step}/{totalSteps}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {totalSteps && (
        <div style={{ background: '#bfdbfe', height: 4 }}>
          <div style={{
            background: '#3b82f6',
            height: '100%',
            width: `${(step / totalSteps) * 100}%`,
            transition: 'width 0.2s',
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>
        {children}
      </div>
    </div>
  )
}
