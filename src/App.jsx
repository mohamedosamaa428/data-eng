import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import VisualizationsPage from './pages/VisualizationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<VisualizationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
