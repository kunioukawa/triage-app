import { useState } from 'react'
import FormShell from '../components/FormShell'
import VitalsInput from '../components/VitalsInput'

export default function SymptomsReturn({ patient, onComplete, onBack }) {
  const [concern, setConcern] = useState('')
  const [isAcute, setIsAcute] = useState(null) // null | true | false
  const [vitals, setVitals] = useState({ temp: '', bp: '', pulse: '', spo2: '' })

  const canSubmit = concern.trim().length > 0 && isAcute !== null

  const handleSubmit = () => {
    onComplete({
      type: 'symptoms-return',
      type_label: '症状あり受診（再診）',
      timestamp: new Date().toISOString(),
      concern,
      is_acute: isAcute,
      vitals: isAcute ? vitals : null,
    })
  }

  const YNBtn = ({ label, value, onClick }) => (
    <button onClick={onClick} style={{
      flex: 1, padding: '20px 10px', fontSize: 18, fontWeight: 'bold',
      borderRadius: 12, border: '2px solid',
      borderColor: isAcute === value ? '#3b82f6' : '#e2e8f0',
      background: isAcute === value ? '#eff6ff' : '#fff',
      cursor: 'pointer', color: '#1e293b',
    }}>{label}</button>
  )

  return (
    <FormShell patient={patient} title="症状あり受診（再診）" onBack={onBack}>

      {/* 相談内容 */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, color: '#64748b', fontWeight: '600', marginBottom: 10 }}>
          今日はどんなことを相談したいですか？
        </div>
        <textarea
          placeholder="例）先週から咳が続いている&#10;血圧の薬を変えたい&#10;検査結果について聞きたい"
          value={concern}
          onChange={e => setConcern(e.target.value)}
          style={{ minHeight: 130 }}
          autoFocus
        />
      </div>

      {/* 急性疾患疑い */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, color: '#64748b', fontWeight: '600', marginBottom: 4 }}>
          急性の症状・急ぎの対応が必要そうですか？
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
          発熱・強い痛み・呼吸困難・急な体調悪化など
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <YNBtn label="はい（バイタル測定）" value={true} onClick={() => setIsAcute(true)} />
          <YNBtn label="いいえ" value={false} onClick={() => setIsAcute(false)} />
        </div>
      </div>

      {/* バイタル（急性の場合のみ） */}
      {isAcute && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 15, color: '#64748b', fontWeight: '600', marginBottom: 12 }}>
            バイタルサイン
          </div>
          <VitalsInput value={vitals} onChange={setVitals} />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
          borderRadius: 12, border: 'none',
          cursor: canSubmit ? 'pointer' : 'default',
          background: canSubmit ? '#3b82f6' : '#cbd5e1',
          color: '#fff', marginTop: 4,
        }}
      >
        問診完了
      </button>
    </FormShell>
  )
}
