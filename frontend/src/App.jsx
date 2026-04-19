import { useState, useEffect } from 'react'
import PatientList from './screens/PatientList'
import PurposeSelect from './screens/PurposeSelect'
import SymptomsNew from './screens/SymptomsNew'
import SymptomsReturn from './screens/SymptomsReturn'
import RegularVisit from './screens/RegularVisit'
import KenshinForm from './screens/KenshinForm'
import NaishikyoForm from './screens/NaishikyoForm'
import VaccineNote from './screens/VaccineNote'

const API = ''

export default function App() {
  const [screen, setScreen] = useState('patientList')
  const [patient, setPatient] = useState(null)
  const [kenshinType, setKenshinType] = useState(null)
  const [patients, setPatients] = useState([])

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API}/patients`)
      const data = await res.json()
      setPatients(data)
    } catch { /* backend unavailable in dev */ }
  }

  useEffect(() => { fetchPatients() }, [])

  const patchStatus = async (id, status) => {
    try {
      await fetch(`${API}/patients/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch { /* ignore */ }
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const handleSelectPatient = (p) => {
    setPatient(p)
    patchStatus(p.id, '対応中')
    setScreen('purposeSelect')
  }

  const handlePurpose = (purpose) => {
    if (purpose === 'symptoms') {
      setScreen(patient.is_new_visit ? 'symptoms-new' : 'symptoms-return')
    } else if (purpose === 'regular') {
      setScreen('regular')
    } else if (purpose === 'kenshin-kouki') {
      setKenshinType('kouki')
      setScreen('kenshin')
    } else if (purpose === 'kenshin-other') {
      setKenshinType('other')
      setScreen('kenshin')
    } else if (purpose === 'naishikyo') {
      setScreen('naishikyo')
    } else if (purpose === 'vaccine') {
      setScreen('vaccine')
    }
  }

  const handleComplete = async (data) => {
    try {
      await fetch(`${API}/patients/${patient.id}/questionnaire`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire: data }),
      })
    } catch { /* ignore */ }
    setPatients(prev => prev.map(p =>
      p.id === patient.id ? { ...p, status: '完了', questionnaire: data } : p
    ))
    setPatient(null)
    setScreen('patientList')
  }

  const handleBack = () => {
    if (screen === 'purposeSelect') {
      patchStatus(patient.id, '未対応')
      setPatient(null)
      setScreen('patientList')
    } else {
      setScreen('purposeSelect')
    }
  }

  const sharedProps = { patient, onComplete: handleComplete, onBack: handleBack }

  return (
    <div>
      {screen === 'patientList'     && <PatientList patients={patients} onSelect={handleSelectPatient} onRefresh={fetchPatients} />}
      {screen === 'purposeSelect'   && <PurposeSelect patient={patient} onSelect={handlePurpose} onBack={handleBack} />}
      {screen === 'symptoms-new'    && <SymptomsNew    {...sharedProps} />}
      {screen === 'symptoms-return' && <SymptomsReturn {...sharedProps} />}
      {screen === 'regular'         && <RegularVisit   {...sharedProps} />}
      {screen === 'kenshin'         && <KenshinForm    {...sharedProps} kenshinType={kenshinType} />}
      {screen === 'naishikyo'       && <NaishikyoForm  {...sharedProps} />}
      {screen === 'vaccine'         && <VaccineNote    {...sharedProps} />}
    </div>
  )
}
