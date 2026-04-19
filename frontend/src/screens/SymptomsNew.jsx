import { useState } from 'react'
import FormShell from '../components/FormShell'
import VitalsInput from '../components/VitalsInput'
import { ASSOCIATED_SYMPTOMS } from '../data/questions'

const ONSET_CHOICES = [
  '今日（数時間以内）', '昨日から', '数日前から', '1週間前から',
  '2週間〜1ヶ月前から', '1ヶ月以上前から',
]
const SEVERITY_CHOICES = [
  { label: '1〜3　軽度（気になる程度）', value: '軽度' },
  { label: '4〜6　中等度（日常生活に支障）', value: '中等度' },
  { label: '7〜9　重度（かなりつらい）', value: '重度' },
  { label: '10　　最大（我慢できない）', value: '最大' },
]

const ChoiceBtn = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    display: 'block', width: '100%', textAlign: 'left',
    padding: '14px 16px', marginBottom: 8, borderRadius: 10,
    border: selected ? '2px solid #3b82f6' : '2px solid #e2e8f0',
    background: selected ? '#eff6ff' : '#fff',
    fontSize: 17, cursor: 'pointer', color: '#1e293b',
    fontWeight: selected ? '600' : '400',
  }}>{label}</button>
)

const Section = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 16 }}>
    <div style={{ fontSize: 14, color: '#64748b', fontWeight: '600', marginBottom: 12 }}>{title}</div>
    {children}
  </div>
)

const STEPS = ['主訴', '発症時期', '程度', '随伴症状', '既往歴', '嗜好品', '家族歴', 'バイタル']

export default function SymptomsNew({ patient, onComplete, onBack }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    chief_complaint: '',
    onset: '',
    onset_detail: '',
    severity: '',
    nrs: '',
    associated: [],
    associated_other: '',
    medical_history: '',
    habits_smoke: '',
    habits_smoke_detail: '',
    habits_alcohol: '',
    habits_alcohol_detail: '',
    family_history: '',
    vitals: { temp: '', bp: '', pulse: '', spo2: '' },
  })

  const set = (k, v) => setData(prev => ({ ...prev, [k]: v }))
  const setVitals = (v) => set('vitals', v)

  const toggleAssoc = (s) => {
    set('associated', data.associated.includes(s)
      ? data.associated.filter(x => x !== s)
      : [...data.associated, s])
  }

  const canNext = () => {
    if (step === 0) return data.chief_complaint.trim().length > 0
    if (step === 1) return data.onset.length > 0
    if (step === 2) return data.severity.length > 0
    return true
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else handleSubmit()
  }

  const handleSubmit = () => {
    onComplete({
      type: 'symptoms-new',
      type_label: '症状あり受診（初診）',
      timestamp: new Date().toISOString(),
      ...data,
    })
  }

  const stepContent = [
    // 0: 主訴
    <Section title="主訴　— 今日はどうされましたか？">
      <textarea
        placeholder="例）昨日から右下腹部が痛い、熱はない"
        value={data.chief_complaint}
        onChange={e => set('chief_complaint', e.target.value)}
        style={{ minHeight: 120 }}
        autoFocus
      />
    </Section>,

    // 1: 発症時期
    <Section title="発症時期　— いつ頃からですか？">
      {ONSET_CHOICES.map(c => (
        <ChoiceBtn key={c} label={c} selected={data.onset === c} onClick={() => set('onset', c)} />
      ))}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 6 }}>詳しく（任意）</div>
        <input type="text" placeholder="例）夕食後から、朝起きたら" value={data.onset_detail}
          onChange={e => set('onset_detail', e.target.value)} />
      </div>
    </Section>,

    // 2: 程度
    <Section title="程度　— どのくらいつらいですか？">
      {SEVERITY_CHOICES.map(c => (
        <ChoiceBtn key={c.value} label={c.label} selected={data.severity === c.value}
          onClick={() => set('severity', c.value)} />
      ))}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 6 }}>NRS（0〜10の数字）</div>
        <input type="number" min="0" max="10" placeholder="7" value={data.nrs}
          onChange={e => set('nrs', e.target.value)} style={{ width: 100 }} />
      </div>
    </Section>,

    // 3: 随伴症状
    <Section title="随伴症状　— 他に気になる症状はありますか？（複数可）">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ASSOCIATED_SYMPTOMS.map(s => {
          const sel = data.associated.includes(s)
          return (
            <button key={s} onClick={() => toggleAssoc(s)} style={{
              padding: '12px 10px', borderRadius: 10, border: '2px solid',
              borderColor: sel ? '#3b82f6' : '#e2e8f0',
              background: sel ? '#eff6ff' : '#fff',
              fontSize: 16, cursor: 'pointer', color: '#1e293b',
              fontWeight: sel ? '600' : '400',
            }}>{s}</button>
          )
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        <input type="text" placeholder="その他（自由記述）" value={data.associated_other}
          onChange={e => set('associated_other', e.target.value)} />
      </div>
    </Section>,

    // 4: 既往歴
    <Section title="既往歴　— これまでにかかった病気や手術はありますか？">
      <textarea
        placeholder="例）高血圧（20年前〜）、胆嚢摘出術（10年前）"
        value={data.medical_history}
        onChange={e => set('medical_history', e.target.value)}
        style={{ minHeight: 100 }}
      />
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>なければ「なし」と入力してください</div>
    </Section>,

    // 5: 嗜好品
    <Section title="嗜好品">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: '600', marginBottom: 8 }}>喫煙</div>
        {['現在吸っている', '以前吸っていた（禁煙済み）', '吸わない'].map(c => (
          <ChoiceBtn key={c} label={c} selected={data.habits_smoke === c} onClick={() => set('habits_smoke', c)} />
        ))}
        {data.habits_smoke === '現在吸っている' && (
          <input type="text" placeholder="例）20本/日・30年" value={data.habits_smoke_detail}
            onChange={e => set('habits_smoke_detail', e.target.value)} style={{ marginTop: 4 }} />
        )}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: '600', marginBottom: 8 }}>飲酒</div>
        {['ほぼ毎日', '週に数回', '時々（月1〜数回）', 'ほとんど飲まない'].map(c => (
          <ChoiceBtn key={c} label={c} selected={data.habits_alcohol === c} onClick={() => set('habits_alcohol', c)} />
        ))}
        {['ほぼ毎日', '週に数回'].includes(data.habits_alcohol) && (
          <input type="text" placeholder="例）ビール350ml×2本" value={data.habits_alcohol_detail}
            onChange={e => set('habits_alcohol_detail', e.target.value)} style={{ marginTop: 4 }} />
        )}
      </div>
    </Section>,

    // 6: 家族歴
    <Section title="家族歴　— ご家族に特定の病気はありますか？">
      <textarea
        placeholder="例）父：心筋梗塞、母：乳がん"
        value={data.family_history}
        onChange={e => set('family_history', e.target.value)}
        style={{ minHeight: 100 }}
      />
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>なければ「特になし」と入力してください</div>
    </Section>,

    // 7: バイタル
    <Section title="バイタルサイン">
      <VitalsInput value={data.vitals} onChange={setVitals} />
    </Section>,
  ]

  return (
    <FormShell
      patient={patient}
      title="症状あり受診（初診）"
      step={step + 1}
      totalSteps={STEPS.length}
      onBack={step === 0 ? onBack : () => setStep(step - 1)}
    >
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 }}>
        {STEPS[step]}
      </div>

      {stepContent[step]}

      <button
        onClick={handleNext}
        disabled={!canNext()}
        style={{
          width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
          borderRadius: 12, border: 'none', cursor: canNext() ? 'pointer' : 'default',
          background: canNext() ? '#3b82f6' : '#cbd5e1',
          color: '#fff', marginTop: 8,
        }}
      >
        {step < STEPS.length - 1 ? '次へ →' : '問診完了'}
      </button>
    </FormShell>
  )
}
