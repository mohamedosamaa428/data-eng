import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Left Sidebar (Optional) */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content Area - Routes render here */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
