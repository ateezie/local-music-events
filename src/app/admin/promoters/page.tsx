'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'
import ImageUpload from '@/components/ImageUpload'

interface Promoter {
  id: string
  name: string
  slug?: string
  description?: string
  website?: string
  email?: string
  phone?: string
  image?: string
  facebook?: string
  instagram?: string
  twitter?: string
  eventCount?: number
  createdAt?: string
  updatedAt?: string
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export default function PromotersPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [loading, setLoading] = useState(true)
  const [promotersLoading, setPromotersLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    // Verify authentication
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        setUser(data.user)
        loadPromoters()
      } else {
        localStorage.removeItem('admin_token')
        router.push('/admin')
      }
    })
    .catch(() => {
      localStorage.removeItem('admin_token')
      router.push('/admin')
    })
    .finally(() => setLoading(false))
  }, [router])

  const loadPromoters = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/promoters', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPromoters(data.promoters || [])
      }
    } catch (error) {
      console.error('Error loading promoters:', error)
    } finally {
      setPromotersLoading(false)
    }
  }


  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete promoter "${name}"?\n\nThis will not delete events but will remove the promoter record.`)) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/promoters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadPromoters()
        alert('✅ Promoter deleted successfully!')
      } else {
        const data = await response.json()
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting promoter:', error)
      alert('Error deleting promoter')
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-400">Loading promoters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-800">
      <AdminHeader title="Promoter Management" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-50 mb-2">Promoters</h2>
            <p className="text-neutral-400">Manage event promoters and their information</p>
          </div>
          <Link
            href="/admin/promoters/new"
            className="bg-resolution-600 text-white px-4 py-2 rounded-md hover:bg-resolution-700 transition-colors duration-200"
          >
            Add New Promoter
          </Link>
        </div>


        {/* Promoters Table */}
        <div className="bg-neutral-700 rounded-lg shadow-medium overflow-hidden">
          {promotersLoading ? (
            <div className="p-8 text-center">
              <p className="text-neutral-400">Loading promoters...</p>
            </div>
          ) : promoters.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-neutral-50 mb-2">No promoters found</h3>
              <p className="text-neutral-400 mb-6">Add your first promoter to start managing event organizers!</p>
              <Link
                href="/admin/promoters/new"
                className="bg-resolution-600 text-white px-4 py-2 rounded-md hover:bg-resolution-700 transition-colors duration-200"
              >
                Add New Promoter
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full divide-y divide-neutral-600">
                <thead className="bg-neutral-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-2/5">
                      Promoter
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-1/5">
                      Contact
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-1/12">
                      Events
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-1/12">
                      Social
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-700 divide-y divide-neutral-600">
                  {promoters.map((promoter) => (
                    <tr key={promoter.id} className="hover:bg-neutral-600 transition-colors duration-200">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {promoter.image && (
                            <div className="flex-shrink-0 mr-3">
                              <img
                                src={promoter.image}
                                alt={promoter.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-neutral-50 truncate">
                              {promoter.name}
                            </div>
                            {promoter.description && (
                              <div className="text-xs text-neutral-400 truncate">
                                {promoter.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-neutral-50">
                        <div className="space-y-1">
                          {promoter.email && (
                            <div className="text-xs truncate" title={promoter.email}>
                              📧 {promoter.email}
                            </div>
                          )}
                          {promoter.phone && (
                            <div className="text-xs">
                              📞 {promoter.phone}
                            </div>
                          )}
                          {promoter.website && (
                            <div className="text-xs">
                              <a href={promoter.website} target="_blank" rel="noopener noreferrer" className="text-resolution-400 hover:text-resolution-300 truncate block transition-colors duration-200">
                                🌐 Website
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-neutral-50">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-resolution-100 text-resolution-800">
                          {promoter.eventCount || 0}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-neutral-50">
                        <div className="flex space-x-2">
                          {promoter.facebook && (
                            <a href={promoter.facebook} target="_blank" rel="noopener noreferrer" className="text-resolution-500 hover:text-resolution-400 transition-colors duration-200" title="Facebook">
                              📘
                            </a>
                          )}
                          {promoter.instagram && (
                            <a href={promoter.instagram} target="_blank" rel="noopener noreferrer" className="text-cardinal-400 hover:text-cardinal-300 transition-colors duration-200" title="Instagram">
                              📸
                            </a>
                          )}
                          {promoter.twitter && (
                            <a href={promoter.twitter} target="_blank" rel="noopener noreferrer" className="text-resolution-400 hover:text-resolution-300 transition-colors duration-200" title="Twitter">
                              🐦
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/promoters/${promoter.slug || promoter.id}/edit`}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-resolution-400 hover:text-resolution-300 hover:bg-neutral-600 transition-colors duration-200"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(promoter.id, promoter.name)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-cardinal-400 hover:text-cardinal-300 hover:bg-neutral-600 transition-colors duration-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}