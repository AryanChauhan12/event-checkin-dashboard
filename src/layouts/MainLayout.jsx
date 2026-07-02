import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@components/Sidebar/Sidebar'
import Header from '@components/Header/Header'
import './MainLayout.css'

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {isSidebarOpen && (
        <div className="main-layout__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main-layout__content-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
