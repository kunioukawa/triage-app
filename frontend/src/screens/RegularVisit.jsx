import { useState, useMemo } from 'react'
import FormShell from '../components/FormShell'
import VitalsInput from '../components/VitalsInput'
import { CORE_QUESTIONS, RANDOM_POOL } from '../data/questions'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ChoiceBtn = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    display: 'block', width: '100%', textAlign: 'left',
    padding: '14px 16px', marginBottom: 8, borderRadius: 10,
    border: `2px solid ${selected ? '#3b82f6' : '#e2e8f0'}`,
    background: selected ? '#eff6ff' : '#fff',
    fontSize: 17, cursor: 'pointer', color: '#1e293b',
    fontWeight: selected ? '600' : '400',
  }}>{label}</button>
)

function QuestionCard({ q, answer, onAnswer }) {
  const [detail, setDetail] = useState('')

  const handleYesNo = (val) => {
    onAnswer({ value: val, detail: val === 'yes' ? detail : '' })
  }

  if (q.type === 'choice') {
    return (
      <div>
        {q.choices.map(c => (
          <ChoiceBtn key={c} label={c}
            selected={answer?.value === c}
            onClick={() => onAnswer({ value: c })} />
        ))}
      </div>
    )
  }

  if (q.type === 'yesno') {
    const isYes = answer?.value === 'yes'
    return (
      <div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <button onClick={() => { setDetail(''); handleYesNo('yes') }} style={{
            flex: 1, padding: '18px', fontSize: 17, fontWeight: 'bold',
            borderRadius: 10, border: `2px solid ${isYes ? '#3b82f6' : '#e2e8f0'}`,
            background: isYes ? '#eff6ff' : '#fff', cursor: 'pointer', color: '#1e293b',
          }}>はい</button>
          <button onClick={() => onAnswer({ value: 'no', detail: '' })} style={{
            flex: 1, padding: '18px', fontSize: 17, fontWeight: 'bold',
            borderRadius: 10, border: `2px solid ${answer?.value === 'no' ? '#3b82f6' : '#e2e8f0'}`,
            background: answer?.value === 'no' ? '#eff6ff' : '#fff', cursor: 'pointer', color: '#1e293b',
          }}>いいえ</button>
        </div>
        {isYes && q.yesPlaceholder && (
          <input type="text" placeholder={q.yesPlaceholder}
            value={detail}
            onChange={e => { setDetail(e.target.value); onAnswer({ value: 'yes', detail: e.target.value }) }}
          />
        )}
      </div>
    )
  }

  return null
}

export default function RegularVisit({ patient, onComplete, onBack }) {
  // ランダム問診セットを初回マウント時に確定
  const questions = useMemo(() => {
    const randomPick = shuffle(RANDOM_POOL).slice(0, 4)
    return [...CORE_QUESTIONS, ...randomPick]
  }, [])

  const totalSteps = questions.length + 1 // +1 for vitals
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [vitals, setVitals] = useState({ temp: '', bp: '', pulse: '', spo2: '' })

  const isVitalsStep = step === questions.length
  const currentQ = questions[step]

  const setAnswer = (id, ans) => setAnswers(prev => ({ ...prev, [id]: ans }))

  const canNext = () => {
    if (isVitalsStep) return true
    return !!answers[currentQ.id]
  }

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1)
    else handleSubmit()
  }

  const handleSubmit = () => {
    onComplete({
      type: 'regular',
      type_label: '普段の受診（定期）',
      timestamp: new Date().toISOString(),
      questions_asked: questions.map(q => ({
        id: q.id,
        category: q.category,
        label: q.label,
        answer: answers[q.id]?.value ?? '',
        detail: answers[q.id]?.detail ?? '',
      })),
      vitals,
    })
  }

  return (
    <FormShell
      patient={patient}
      title="普段の受診（定期）"
      step={step + 1}
      totalSteps={totalSteps}
      onBack={step === 0 ? onBack : () => setStep(step - 1)}
    >
      {!isVitalsStep ? (
        <div>
          {/* Category badge */}
          <div style={{
            display: 'inline-block',
            background: '#dbeafe', color: '#1d4ed8',
            borderRadius: 20, padding: '4px 14px', fontSize: 13,
            fontWeight: '600', marginBottom: 12,
          }}>{currentQ.category}</div>

          <div style={{
            fontSize: 20, fontWeight: 'bold', color: '#1e293b',
            marginBottom: 20, lineHeight: 1.5,
          }}>{currentQ.label}</div>

          <div style={{ background: '#fff', borderRadius: 14, padding: '16px' }}>
            <QuestionCard
              q={currentQ}
              answer={answers[currentQ.id]}
              onAnswer={(ans) => setAnswer(currentQ.id, ans)}
            />
          </div>

          {/* Skip */}
          <button onClick={() => {
            setAnswer(currentQ.id, { value: '（スキップ）', detail: '' })
            setStep(step + 1)
          }} style={{
            display: 'block', width: '100%', marginTop: 10, padding: '12px',
            borderRadius: 10, border: '1px solid #e2e8f0', background: 'transparent',
            color: '#94a3b8', fontSize: 15, cursor: 'pointer',
          }}>スキップ</button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 }}>
            バイタルサイン
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px' }}>
            <VitalsInput value={vitals} onChange={setVitals} />
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        style={{
          width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
          borderRadius: 12, border: 'none', cursor: 'pointer',
          background: canNext() ? '#3b82f6' : '#cbd5e1',
          color: '#fff', marginTop: 16,
        }}
      >
        {step < totalSteps - 1 ? '次へ →' : '問診完了'}
      </button>
    </FormShell>
  )
}
