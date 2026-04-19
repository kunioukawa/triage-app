const STATUS_COLOR = {
  '未対応': { bg: '#f1f5f9', border: '#cbd5e1', text: '#475569' },
  '対応中': { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' },
  '完了':   { bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
}

export default function PatientList({ patients, onSelect, onRefresh }) {
  const now = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: '#1e40af',
        color: '#fff',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>外来問診</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>{now} 現在</div>
        </div>
        <button onClick={onRefresh} style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 15,
          cursor: 'pointer',
        }}>更新</button>
      </div>

      {/* Stats bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 20px',
        display: 'flex',
        gap: 20,
        fontSize: 14,
        color: '#64748b',
        flexShrink: 0,
      }}>
        <span>全{patients.length}名</span>
        <span style={{ color: '#475569' }}>未対応 {patients.filter(p => p.status === '未対応').length}</span>
        <span style={{ color: '#1d4ed8' }}>対応中 {patients.filter(p => p.status === '対応中').length}</span>
        <span style={{ color: '#15803d' }}>完了 {patients.filter(p => p.status === '完了').length}</span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {patients.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 60, fontSize: 16 }}>
            本日の受付患者はいません
          </div>
        )}
        {patients.map(p => {
          const sc = STATUS_COLOR[p.status] || STATUS_COLOR['未対応']
          const done = p.status === '完了'
          return (
            <button
              key={p.id}
              onClick={() => !done && onSelect(p)}
              disabled={done}
              style={{
                display: 'block',
                width: '100%',
                background: sc.bg,
                border: `2px solid ${sc.border}`,
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 10,
                textAlign: 'left',
                cursor: done ? 'default' : 'pointer',
                opacity: done ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: sc.border,
                    color: sc.text,
                    borderRadius: 6,
                    padding: '2px 10px',
                    fontSize: 13,
                    fontWeight: 'bold',
                    marginBottom: 6,
                  }}>{p.status}</span>
                  {p.is_new_visit && (
                    <span style={{
                      display: 'inline-block',
                      background: '#fef3c7',
                      color: '#92400e',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginLeft: 6,
                      marginBottom: 6,
                    }}>初診</span>
                  )}
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
                    {p.kana}　{p.age}歳
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 'bold', color: sc.text }}>
                    {p.reception_time}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>受付</div>
                </div>
              </div>
              {done && p.questionnaire && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                  問診完了: {p.questionnaire.type_label ?? p.questionnaire.type}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
