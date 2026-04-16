import { useState, useEffect } from "react"

const API = ""

const LEVEL_CONFIG = {
  1: { label: "最重症", color: "#c0392b", bg: "#fdecea" },
  2: { label: "重症",   color: "#e67e22", bg: "#fef3e2" },
  3: { label: "中等症", color: "#f1c40f", bg: "#fefde2" },
  4: { label: "軽症",   color: "#27ae60", bg: "#eafaf1" },
  5: { label: "非緊急", color: "#2980b9", bg: "#eaf4fb" },
}

const EMPTY = {
  name: "", age: "", chief_complaint: "",
  pain_score: 0, vital_temp: "", vital_spo2: "", vital_bp: "", notes: ""
}

export default function App() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchPatients = async () => {
    const res = await fetch(`${API}/patients`)
    const data = await res.json()
    setPatients(data.sort((a, b) => a.triage_level - b.triage_level))
  }

  useEffect(() => { fetchPatients() }, [])

  const submit = async () => {
    if (!form.name || !form.chief_complaint || !form.age) {
      alert("氏名・年齢・主訴は必須です")
      return
    }
    setLoading(true)
    await fetch(`${API}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        pain_score: Number(form.pain_score),
        vital_temp: form.vital_temp ? Number(form.vital_temp) : null,
        vital_spo2: form.vital_spo2 ? Number(form.vital_spo2) : null,
        vital_bp: form.vital_bp || null,
        notes: form.notes || null,
      })
    })
    setForm(EMPTY)
    setShowForm(false)
    setLoading(false)
    fetchPatients()
  }

  const discharge = async (id) => {
    if (!confirm("この患者を退出済みにしますか？")) return
    await fetch(`${API}/patients/${id}`, { method: "DELETE" })
    fetchPatients()
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>🏥 外来トリアージ</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background: "#2980b9", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 16, cursor: "pointer" }}>
          {showForm ? "閉じる" : "＋ 新規受付"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #ddd" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16 }}>患者情報入力</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "氏名 *", key: "name", type: "text", placeholder: "山田 太郎" },
              { label: "年齢 *", key: "age", type: "number", placeholder: "65" },
              { label: "主訴 *", key: "chief_complaint", type: "text", placeholder: "腹痛、嘔吐" },
              { label: "体温 (℃)", key: "vital_temp", type: "number", placeholder: "37.2" },
              { label: "SpO2 (%)", key: "vital_spo2", type: "number", placeholder: "98" },
              { label: "血圧", key: "vital_bp", type: "text", placeholder: "120/80" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{label}</div>
                <input type={type} value={form[key]} placeholder={placeholder}
                  onChange={e => f(key, e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 15, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>疼痛スコア: {form.pain_score}</div>
            <input type="range" min={0} max={10} value={form.pain_score}
              onChange={e => f("pain_score", e.target.value)}
              style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888" }}>
              <span>0 痛みなし</span><span>10 最大の痛み</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>備考</div>
            <textarea value={form.notes} onChange={e => f("notes", e.target.value)}
              placeholder="アレルギー、既往歴など"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, boxSizing: "border-box", height: 60 }} />
          </div>

          <button onClick={submit} disabled={loading}
            style={{ marginTop: 14, width: "100%", background: "#27ae60", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 16, cursor: "pointer" }}>
            {loading ? "登録中..." : "受付登録"}
          </button>
        </div>
      )}

      <div>
        {patients.length === 0 && (
          <div style={{ textAlign: "center", color: "#999", padding: 40 }}>待機中の患者はいません</div>
        )}
        {patients.map(p => {
          const lv = LEVEL_CONFIG[p.triage_level] || LEVEL_CONFIG[5]
          return (
            <div key={p.id} style={{ background: lv.bg, border: `2px solid ${lv.color}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ background: lv.color, color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: "bold", marginRight: 8 }}>
                    Lv.{p.triage_level} {lv.label}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: "bold" }}>{p.name}</span>
                  <span style={{ color: "#555", marginLeft: 8, fontSize: 14 }}>{p.age}歳</span>
                </div>
                <button onClick={() => discharge(p.id)}
                  style={{ background: "#ecf0f1", border: "1px solid #bdc3c7", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>
                  退出
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 15 }}>🩺 {p.chief_complaint}</div>
              <div style={{ marginTop: 6, display: "flex", gap: 12, fontSize: 13, color: "#555", flexWrap: "wrap" }}>
                <span>痛み: {p.pain_score}/10</span>
                {p.vital_temp && <span>🌡 {p.vital_temp}℃</span>}
                {p.vital_spo2 && <span>💨 SpO2 {p.vital_spo2}%</span>}
                {p.vital_bp && <span>💉 {p.vital_bp}</span>}
              </div>
              {p.notes && <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>📝 {p.notes}</div>}
              <div style={{ marginTop: 4, fontSize: 11, color: "#999" }}>
                受付: {new Date(p.arrived_at).toLocaleTimeString("ja-JP")}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
