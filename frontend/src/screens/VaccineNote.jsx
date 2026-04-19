import FormShell from '../components/FormShell'

export default function VaccineNote({ patient, onComplete, onBack }) {
  return (
    <FormShell patient={patient} title="ワクチンのみ" onBack={onBack}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '32px 20px',
        textAlign: 'center', marginBottom: 20,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 }}>
          紙の問診票をご使用ください
        </div>
        <div style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7 }}>
          ワクチン接種の問診は<br />
          所定の紙の問診票で対応してください。<br />
          <br />
          デジタル記録は残しません。
        </div>
      </div>

      <button onClick={() => onComplete({ type: 'vaccine', type_label: 'ワクチンのみ（紙対応）', timestamp: new Date().toISOString() })}
        style={{
          width: '100%', padding: '18px', fontSize: 18, fontWeight: 'bold',
          borderRadius: 12, border: 'none', cursor: 'pointer',
          background: '#64748b', color: '#fff',
        }}>
        確認　→ 患者リストへ戻る
      </button>
    </FormShell>
  )
}
