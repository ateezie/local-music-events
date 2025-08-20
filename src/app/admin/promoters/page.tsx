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
  const [showForm, setShowForm] = useState(false)
  const [editingPromoter, setEditingPromoter] = useState<Promoter | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    image: '',
    facebook: '',
    instagram: '',
    twitter: ''
  })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingPromoter ? `/api/promoters/${editingPromoter.id}` : '/api/promoters'
      const method = editingPromoter ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        loadPromoters()
        setShowForm(false)
        setEditingPromoter(null)
        resetForm()
        alert(editingPromoter ? '✅ Promoter updated successfully!' : '✅ Promoter created successfully!')
      } else {
        const data = await response.json()
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving promoter:', error)
      alert('Error saving promoter')
    }
  }

  const handleEdit = (promoter: Promoter) => {
    setEditingPromoter(promoter)
    setFormData({
      name: promoter.name,
      description: promoter.description || '',
      website: promoter.website || '',
      email: promoter.email || '',
      phone: promoter.phone || '',
      image: promoter.image || '',
      facebook: promoter.facebook || '',
      instagram: promoter.instagram || '',
      twitter: promoter.twitter || ''
    })
    setShowForm(true)
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      image: '',
      facebook: '',
      instagram: '',
      twitter: ''
    })
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
          <button
            onClick={() => {
              setEditingPromoter(null)
              resetForm()
              setShowForm(true)
            }}
            className="bg-resolution-600 text-white px-4 py-2 rounded-md hover:bg-resolution-700 transition-colors duration-200"
          >
            Add New Promoter
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-neutral-700 rounded-lg shadow-medium p-6 mb-8">
            <h3 className="text-lg font-medium text-neutral-50 mb-6">
              {editingPromoter ? 'Edit Promoter' : 'Add New Promoter'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Promoter Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  placeholder="Describe the promoter organization..."
                />
              </div>

              <div>
                <ImageUpload
                  currentImage={formData.image}
                  onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  label="Promoter Logo/Image"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPromoter(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-neutral-500 rounded-md text-neutral-300 hover:bg-neutral-600 bg-neutral-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-resolution-600 text-white rounded-md hover:bg-resolution-700 transition-colors duration-200"
                >
                  {editingPromoter ? 'Update Promoter' : 'Add Promoter'}
                </button>
              </div>
            </form>
          </div>
        )}

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
              <button
                onClick={() => {
                  setEditingPromoter(null)
                  resetForm()
                  setShowForm(true)
                }}
                className="bg-resolution-600 text-white px-4 py-2 rounded-md hover:bg-resolution-700 transition-colors duration-200"
              >
                Add New Promoter
              </button>
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
                          <button
                            onClick={() => handleEdit(promoter)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-resolution-400 hover:text-resolution-300 hover:bg-neutral-600 transition-colors duration-200"
                          >
                            ✏️ Edit
                          </button>
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