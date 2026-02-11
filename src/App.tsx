import { Routes, Route, Navigate } from 'react-router-dom'
import { PanelPage } from './pages/PanelPage.tsx'
import { Dashboard } from './pages/Dashboard.tsx'

export function App() {
  return (
    <Routes>
      <Route path="/dashboard/:panelId?" element={<Dashboard />} />
      <Route path="/panel/:panelId" element={<PanelPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
