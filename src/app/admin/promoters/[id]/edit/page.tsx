'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditPromoterPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [promoter, setPromoter] = useState<Promoter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  const params = useParams()
  const promoterId = params.id as string

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
        loadPromoter()
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
  }, [router, promoterId])

  const loadPromoter = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/promoters/${promoterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const promoterData = await response.json()
        setPromoter(promoterData)
        setFormData({
          name: promoterData.name || '',
          description: promoterData.description || '',
          website: promoterData.website || '',
          email: promoterData.email || '',
          phone: promoterData.phone || '',
          image: promoterData.image || '',
          facebook: promoterData.facebook || '',
          instagram: promoterData.instagram || '',
          twitter: promoterData.twitter || ''
        })
      } else {
        alert('Promoter not found')
        router.push('/admin/promoters')
      }
    } catch (error) {
      console.error('Error loading promoter:', error)
      alert('Error loading promoter')
      router.push('/admin/promoters')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/promoters/${promoterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Don't show alert - keep the form open with updated data
        loadPromoter() // Reload to get updated data
      } else {
        const data = await response.json()
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving promoter:', error)
      alert('Error saving promoter')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-400">Loading promoter...</p>
        </div>
      </div>
    )
  }

  if (!promoter) {
    return (
      <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400">Promoter not found</p>
          <Link href="/admin/promoters" className="text-resolution-400 hover:text-resolution-300">
            Back to Promoters
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-800">
      <AdminHeader title={`Edit Promoter: ${promoter.name}`} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-neutral-700 rounded-lg shadow-medium p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-50">Edit Promoter</h2>
            <Link
              href="/admin/promoters"
              className="text-neutral-400 hover:text-neutral-300 transition-colors duration-200"
            >
              ← Back to Promoters
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Promoter Image - At Top */}
            <div>
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                label="Promoter Logo/Image"
                className="w-full"
              />
            </div>

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
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-resolution-500 bg-neutral-600 text-white"
                placeholder="Describe the promoter organization..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/promoters"
                className="px-4 py-2 border border-neutral-500 rounded-md text-neutral-300 hover:bg-neutral-600 bg-neutral-700 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-resolution-600 text-white rounded-md hover:bg-resolution-700 disabled:opacity-50 transition-colors duration-200"
              >
                {saving ? 'Updating...' : 'Update Promoter'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}