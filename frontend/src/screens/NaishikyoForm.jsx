import { useState } from 'react'
import FormShell from '../components/FormShell'
import { NAISHIKYO_QUESTIONS } from '../data/questions'

const Section = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', marginBottom: 14 }}>
    <div style={{ fontSize: 14, color: '#64748b', fontWeight: '600', marginBottom: 12 }}>{title}</div>
    {children}
  </div>
)

const ChipBtn = ({ label, selected, onClick, color = '#0891b2' }) => (
  <button onClick={onClick} style={{
    padding: '10px 16px', margin: '0 6px 6px 0', borderRadius: 8, border: '2px solid',
    borderColor: selected ? color : '#e2e8f0',
    background: selected ? `${color}15` : '#fff',
    fontSize: 15, cursor: 'pointer', color: '#1e293b',
    fontWeight: selected ? '600' : '400',
  }}>{label}</button>
)

export default function NaishikyoForm({ patient, onComplete, onBack }) {
  const [examType, setExamType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [prevExam, setPrevExam] = useState(null) // null | 'yes' | 'no'
  const [prevExamDetail, setPrevExamDetail] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [drugs, setDrugs] = useState([])
  const [allergy, setAllergy] = useState('')
  const [sedation, setSedation] = useState(null) // null | 'yes' | 'no'
  const [notes, setNotes] = useState('')
  const [vitals, setVitals] = useState({ temp: '', bp: '', pulse: '', spo2: '' })

  const toggleArr = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const canSubmit = examType.length > 0

  const handleSubmit = () => {
    onComplete({
      type: 'naishikyo',
      type_label: '内視鏡問診',
      timestamp: new Date().toISOString(),
      exam_type: examType,
      purpose,
      prev_exam: prevExam === 'yes' ? prevExamDetail : (prevExam === 'no' ? 'なし' : ''),
      symptoms,
      anticoagulants: drugs,
      allergy,
      sedation: sedation === 'yes' ? '希望する' : (sedation === 'no' ? '希望しない' : ''),
      notes,
      vitals,
    })
  }

  const YNBtn = ({ label, val, state, setState }) => (
    <button onClick={() => setState(val)} style={{
      flex: 1, padding: '14px', fontSize: 16, fontWeight: 'bold',
      borderRadius: 10, border: '2px solid',
      borderColor: state === val ? '#0891b2' : '#e2e8f0',
      background: state === val ? '#ecfeff' : '#fff',
      cursor: 'pointer', color: '#1e293b',
    }}>{label}</button>
  )

  return (
    <FormShell patient={patient} title="内視鏡問診" onBack={onBack}>

      {/* 検査種別 */}
      <Section title="検査の種類">
        {NAISHIKYO_QUESTIONS.type.map(t => (
          <button key={t.value} onClick={() => setExamType(t.value)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '16px', marginBottom: 8, borderRadius: 10, border: '2px solid',
            borderColor: examType === t.value ? '#0891b2' : '#e2e8f0',
            background: examType === t.value ? '#ecfeff' : '#fff',
            fontSize: 18, cursor: 'pointer', color: '#1e293b',
            fontWeight: examType === t.value ? '600' : '400',
          }}>{t.label}</button>
        ))}
      </Section>

      {/* 検査目的・症状 */}
      <Section title="検査の目的・気になる症状（複数可）">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {NAISHIKYO_QUESTIONS.gi_symptoms.map(s => (
            <ChipBtn key={s} label={s} selected={symptoms.includes(s)}
              onClick={() => toggleArr(symptoms, setSymptoms, s)} />
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="text" placeholder="目的・その他の症状（自由記述）" value={purpose}
            onChange={e => setPurpose(e.target.value)} />
        </div>
      </Section>

      {/* 過去の内視鏡 */}
      <Section title="過去に内視鏡検査を受けたことがありますか？">
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <YNBtn label="ある" val="yes" state={prevExam} setState={setPrevExam} />
          <YNBtn label="ない" val="no" state={prevExam} setState={setPrevExam} />
        </div>
        {prevExam === 'yes' && (
          <input type="text" placeholder="いつ頃・どこで・結果（ポリープ切除など）"
            value={prevExamDetail} onChange={e => setPrevExamDetail(e.target.value)} />
        )}
      </Section>

      {/* 抗血栓薬 */}
      <Section title="現在服用中の血液をサラサラにする薬（複数可）">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {NAISHIKYO_QUESTIONS.anticoagulants.map(d => (
            <ChipBtn key={d} label={d} selected={drugs.includes(d)}
              onClick={() => toggleArr(drugs, setDrugs, d)} />
          ))}
        </div>
      </Section>

      {/* アレルギー */}
      <Section title="アレルギー（薬・食べ物・造影剤など）">
        <input type="text" placeholder="例）ペニシリン、卵　／　なし"
          value={allergy} onChange={e => setAllergy(e.target.value)} />
      </Section>

      {/* 鎮静剤 */}
      <Section title="鎮静剤（うとうとする薬）を希望しますか？">
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
          希望される場合は検査後の車の運転ができません
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <YNBtn label="希望する" val="yes" state={sedation} setState={setSedation} />
          <YNBtn label="希望しない" val="no" state={sedation} setState={setSedation} />
        </div>
      </Section>

      {/* バイタル */}
      <Section title="バイタルサイン">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: '体温（℃）', key: 'temp', ph: '36.5' },
            { label: '血圧', key: 'bp', ph: '120/80' },
            { label: '脈拍（/分）', key: 'pulse', ph: '72' },
            { label: 'SpO₂（%）', key: 'spo2', ph: '98' },
          ].map(({ label, key, ph }) => (
            <div key={key}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: '600' }}>{label}</div>
              <input type={key === 'bp' ? 'text' : 'number'} step={key === 'temp' ? '0.1' : '1'}
                placeholder={ph} value={vitals[key] ?? ''}
                onChange={e => setVitals(v => ({ ...v, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </Section>

      {/* 備考 */}
      <Section title="その他・備考">
        <textarea placeholder="気になることがあれば" value={notes}
          onChange={e => setNotes(e.target.value)} style={{ minHeight: 80 }} />
      </Section>

      <button onClick={handleSubmit} disabled={!canSubmit} style={{
        width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
        borderRadius: 12, border: 'none',
        cursor: canSubmit ? 'pointer' : 'default',
        background: canSubmit ? '#0891b2' : '#cbd5e1', color: '#fff',
      }}>
        問診完了
      </button>
    </FormShell>
  )
}
