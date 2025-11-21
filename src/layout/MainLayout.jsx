import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Content Area - Routes render here */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
