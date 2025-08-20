'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'

interface AdminHeaderProps {
  title: string
  showLogout?: boolean
}

export default function AdminHeader({ title, showLogout = true }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <MusicLogo className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/events"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/admin/venues"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              Venues
            </Link>
            <Link
              href="/admin/promoters"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              Promoters
            </Link>
            <Link
              href="/admin/import-ics"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              Import .ics
            </Link>
            <Link 
              href="/"
              className="text-sm text-prussian-600 hover:text-prussian-500 transition-colors"
            >
              View Site
            </Link>
            <Link
              href="/admin/import-review"
              className="text-sm bg-prussian-600 text-white px-3 py-1 rounded hover:bg-prussian-700 transition-colors"
            >
              Import Review
            </Link>
            {showLogout && (
              <button
                onClick={handleLogout}
                className="text-sm bg-chang-brown-600 text-white px-3 py-1 rounded hover:bg-chang-brown-700 transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}