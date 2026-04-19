const BigBtn = ({ label, sub, color, onClick }) => (
  <button onClick={onClick} style={{
    display: 'block',
    width: '100%',
    background: '#fff',
    border: `3px solid ${color}`,
    borderLeft: `8px solid ${color}`,
    borderRadius: 14,
    padding: '20px 18px',
    marginBottom: 12,
    textAlign: 'left',
    cursor: 'pointer',
  }}>
    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b' }}>{label}</div>
    {sub && <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{sub}</div>}
  </button>
)

export default function PurposeSelect({ patient, onSelect, onBack }) {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: '#1e40af',
        color: '#fff',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
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
        }}>← 戻る</button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{patient.name}</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{patient.kana}　{patient.age}歳{patient.is_new_visit ? '　初診' : ''}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        <div style={{ fontSize: 15, color: '#64748b', marginBottom: 16, fontWeight: '600' }}>
          来院目的を選んでください
        </div>

        <BigBtn
          label="症状あり受診"
          sub={patient.is_new_visit ? '→ 初診問診へ（主訴・既往歴・家族歴など）' : '→ 再診問診へ（相談内容・急性症状確認）'}
          color="#ef4444"
          onClick={() => onSelect('symptoms')}
        />

        <BigBtn
          label="普段の受診（定期）"
          sub="体重・睡眠・お腹の具合・バイタルなど"
          color="#3b82f6"
          onClick={() => onSelect('regular')}
        />

        <div style={{ fontSize: 14, color: '#64748b', margin: '8px 0 8px 2px', fontWeight: '600' }}>
          検診
        </div>

        <BigBtn
          label="後期高齢者　特定健診問診"
          sub="75歳以上・広域連合の問診票"
          color="#8b5cf6"
          onClick={() => onSelect('kenshin-kouki')}
        />

        <BigBtn
          label="その他の特定健診問診"
          sub="40〜74歳・生活習慣・服薬状況など"
          color="#8b5cf6"
          onClick={() => onSelect('kenshin-other')}
        />

        <div style={{ fontSize: 14, color: '#64748b', margin: '8px 0 8px 2px', fontWeight: '600' }}>
          検査
        </div>

        <BigBtn
          label="内視鏡問診"
          sub="胃カメラ・大腸カメラ前の問診"
          color="#0891b2"
          onClick={() => onSelect('naishikyo')}
        />

        <div style={{ fontSize: 14, color: '#64748b', margin: '8px 0 8px 2px', fontWeight: '600' }}>
          その他
        </div>

        <BigBtn
          label="ワクチンのみ"
          sub="紙の問診票を使用　→ デジタル記録なし"
          color="#94a3b8"
          onClick={() => onSelect('vaccine')}
        />
      </div>
    </div>
  )
}
