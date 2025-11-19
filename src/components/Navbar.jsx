import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              Data Engineering Project
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isDashboard 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
