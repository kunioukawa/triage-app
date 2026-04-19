const field = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}
const label = {
  fontSize: 14,
  color: '#64748b',
  fontWeight: '600',
}

export default function VitalsInput({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={field}>
          <span style={label}>体温（℃）</span>
          <input type="number" step="0.1" placeholder="36.5"
            value={value.temp ?? ''}
            onChange={e => set('temp', e.target.value)} />
        </div>
        <div style={field}>
          <span style={label}>血圧（mmHg）</span>
          <input type="text" placeholder="120/80"
            value={value.bp ?? ''}
            onChange={e => set('bp', e.target.value)} />
        </div>
        <div style={field}>
          <span style={label}>脈拍（/分）</span>
          <input type="number" placeholder="72"
            value={value.pulse ?? ''}
            onChange={e => set('pulse', e.target.value)} />
        </div>
        <div style={field}>
          <span style={label}>SpO₂（%）</span>
          <input type="number" placeholder="98"
            value={value.spo2 ?? ''}
            onChange={e => set('spo2', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
