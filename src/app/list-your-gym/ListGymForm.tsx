'use client'

import { useState } from 'react'

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida', 'Ghaziabad',
]

const INPUT_CLASS = 'w-full bg-raised b-hair rounded-sm px-3 py-2.5 text-[14px] text-text placeholder:text-accent outline-none focus:border-border-hi transition-colors'

type FormData = {
  gym_name: string
  owner_name: string
  phone: string
  email: string
  city: string
  locality: string
  address: string
  website: string
  message: string
}

export default function ListGymForm() {
  const [formData, setFormData] = useState<FormData>({
    gym_name: '',
    owner_name: '',
    phone: '',
    email: '',
    city: '',
    locality: '',
    address: '',
    website: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const update = (key: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/list-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full bg-accent-dim flex items-center justify-center mx-auto mb-6">
          <i className="ti ti-circle-check text-[32px] text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text mb-3">
          Thanks! We&apos;ll be in touch.
        </h2>
        <p className="text-[#999]">
          We review every submission and will contact you within 24 hours to get your gym listed.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface b-hair rounded-md p-6 space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            Gym Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.gym_name}
            onChange={(e) => update('gym_name', e.target.value)}
            placeholder="e.g. Gold's Gym Andheri"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.owner_name}
            onChange={(e) => update('owner_name', e.target.value)}
            placeholder="Owner or manager name"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 98XXX XXXXX"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            City <span className="text-red-400">*</span>
          </label>
          <select
            required
            value={formData.city}
            onChange={(e) => update('city', e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-accent mb-1.5">
            Locality
          </label>
          <input
            type="text"
            value={formData.locality}
            onChange={(e) => update('locality', e.target.value)}
            placeholder="e.g. Andheri West"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-accent mb-1.5">
          Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="Full street address"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-accent mb-1.5">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => update('website', e.target.value)}
          placeholder="https://yourgym.com"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-accent mb-1.5">
          Anything else we should know
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Monthly fees, timings, amenities, special offerings..."
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[14px] py-3.5 rounded-sm hover:bg-text transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        <i className="ti ti-circle-check text-[16px]" />
        {loading ? 'Submitting...' : 'Submit Listing'}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}

      <p className="text-[12px] text-accent text-center">
        We will review and publish your listing within 24 hours
      </p>
    </form>
  )
}
