'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MusicLogo from '@/components/MusicLogo'
import AdminHeader from '@/components/AdminHeader'
import ImageUpload from '@/components/ImageUpload'

interface Venue {
  id: string
  name: string
  slug?: string
  address: string
  city: string
  state: string
  zipCode?: string
  capacity?: number
  website?: string
  phone?: string
  email?: string
  description?: string
  image?: string
  facebook?: string
  instagram?: string
  twitter?: string
  latitude?: number
  longitude?: number
  amenities?: string
  accessibility?: string
  createdAt: string
  updatedAt: string
  authorId: string
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export default function EditVenuePage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    capacity: '',
    website: '',
    phone: '',
    email: '',
    description: '',
    image: '',
    facebook: '',
    instagram: '',
    twitter: ''
  })
  const router = useRouter()
  const params = useParams()
  const venueId = params.id as string

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
        loadVenue()
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
  }, [router, venueId])

  const loadVenue = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/venues/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const venueData = await response.json()
        setVenue(venueData)
        setFormData({
          name: venueData.name || '',
          address: venueData.address || '',
          city: venueData.city || '',
          state: venueData.state || '',
          zipCode: venueData.zipCode || '',
          capacity: venueData.capacity?.toString() || '',
          website: venueData.website || '',
          phone: venueData.phone || '',
          email: venueData.email || '',
          description: venueData.description || '',
          image: venueData.image || '',
          facebook: venueData.facebook || '',
          instagram: venueData.instagram || '',
          twitter: venueData.twitter || ''
        })
      } else {
        alert('Venue not found')
        router.push('/admin/venues')
      }
    } catch (error) {
      console.error('Error loading venue:', error)
      alert('Error loading venue')
      router.push('/admin/venues')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null
        })
      })

      if (response.ok) {
        // Don't show alert - keep the form open with updated data
        loadVenue() // Reload to get updated data
      } else {
        const data = await response.json()
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving venue:', error)
      alert('Error saving venue')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MusicLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading venue...</p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Venue not found</p>
          <Link href="/admin/venues" className="text-music-blue-600 hover:text-music-blue-700">
            Back to Venues
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title={`Edit Venue: ${venue.name}`} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Venue</h2>
            <Link
              href="/admin/venues"
              className="text-gray-400 hover:text-gray-300"
            >
              ← Back to Venues
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Venue Banner Image - At Top */}
            <div>
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                label="Venue Banner Image"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-music-purple-500 bg-gray-700 text-white"
                placeholder="Describe the venue..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/venues"
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-music-purple-600 text-white rounded-md hover:bg-music-purple-700 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Venue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}