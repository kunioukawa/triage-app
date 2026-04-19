import { useState } from 'react'
import FormShell from '../components/FormShell'
import VitalsInput from '../components/VitalsInput'
import { KENSHIN_KOUKI_QUESTIONS, KENSHIN_OTHER_QUESTIONS } from '../data/questions'

const YNRow = ({ label, value, onChange, yesPlaceholder }) => {
  const [detail, setDetail] = useState('')
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 16, color: '#1e293b', marginBottom: 8, lineHeight: 1.5 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['はい', 'いいえ'].map(opt => {
          const val = opt === 'はい' ? 'yes' : 'no'
          return (
            <button key={opt} onClick={() => onChange({ value: val, detail: val === 'no' ? '' : detail })}
              style={{
                padding: '10px 24px', borderRadius: 8, border: '2px solid',
                borderColor: value?.value === val ? '#8b5cf6' : '#e2e8f0',
                background: value?.value === val ? '#f5f3ff' : '#fff',
                fontSize: 16, cursor: 'pointer', color: '#1e293b',
                fontWeight: value?.value === val ? '600' : '400',
              }}>{opt}</button>
          )
        })}
      </div>
      {value?.value === 'yes' && yesPlaceholder && (
        <input type="text" placeholder={yesPlaceholder} value={detail}
          onChange={e => { setDetail(e.target.value); onChange({ value: 'yes', detail: e.target.value }) }}
          style={{ marginTop: 8 }} />
      )}
    </div>
  )
}

const ChoiceRow = ({ label, choices, value, onChange }) => (
  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
    <div style={{ fontSize: 16, color: '#1e293b', marginBottom: 8, lineHeight: 1.5 }}>{label}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {choices.map(c => (
        <button key={c} onClick={() => onChange({ value: c })}
          style={{
            padding: '10px 16px', borderRadius: 8, border: '2px solid',
            borderColor: value?.value === c ? '#8b5cf6' : '#e2e8f0',
            background: value?.value === c ? '#f5f3ff' : '#fff',
            fontSize: 15, cursor: 'pointer', color: '#1e293b',
            fontWeight: value?.value === c ? '600' : '400',
          }}>{c}</button>
      ))}
    </div>
  </div>
)

export default function KenshinForm({ patient, kenshinType, onComplete, onBack }) {
  const questions = kenshinType === 'kouki' ? KENSHIN_KOUKI_QUESTIONS : KENSHIN_OTHER_QUESTIONS
  const title = kenshinType === 'kouki' ? '後期高齢者特定健診問診' : 'その他の特定健診問診'
  const [answers, setAnswers] = useState({})
  const [vitals, setVitals] = useState({ temp: '', bp: '', pulse: '', spo2: '' })
  const [showVitals, setShowVitals] = useState(false)

  const setAns = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }))

  const handleSubmit = () => {
    onComplete({
      type: `kenshin-${kenshinType}`,
      type_label: title,
      timestamp: new Date().toISOString(),
      answers: questions.map(q => ({
        id: q.id,
        label: q.label,
        answer: answers[q.id]?.value ?? '',
        detail: answers[q.id]?.detail ?? '',
      })),
      vitals,
    })
  }

  return (
    <FormShell patient={patient} title={title} onBack={onBack}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
        {questions.map(q => (
          q.type === 'yesno'
            ? <YNRow key={q.id} label={q.label} value={answers[q.id]}
                yesPlaceholder={q.yesPlaceholder}
                onChange={v => setAns(q.id, v)} />
            : <ChoiceRow key={q.id} label={q.label} choices={q.choices}
                value={answers[q.id]} onChange={v => setAns(q.id, v)} />
        ))}
      </div>

      {/* バイタル */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: '600', color: '#64748b', marginBottom: 12 }}>
          バイタルサイン
        </div>
        <VitalsInput value={vitals} onChange={setVitals} />
      </div>

      <button onClick={handleSubmit} style={{
        width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
        borderRadius: 12, border: 'none', cursor: 'pointer',
        background: '#8b5cf6', color: '#fff',
      }}>
        問診完了
      </button>
    </FormShell>
  )
}
