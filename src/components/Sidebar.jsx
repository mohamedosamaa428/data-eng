import { Link, useLocation } from 'react-router-dom'

function Sidebar({ isOpen = true }) {
  const location = useLocation()
  
  if (!isOpen) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/reports', label: 'Reports', icon: '📄' }
  ]

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Navigation
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
