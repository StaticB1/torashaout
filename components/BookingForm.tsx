'use client'

import { useState } from 'react'
import { User, Mail, MessageSquare, Users, Calendar } from 'lucide-react'

export interface BookingFormData {
  fromName: string
  fromEmail: string
  recipientName: string
  occasion: string
  instructions: string
  deliveryDate?: string
  isPublic: boolean
}

interface BookingFormProps {
  initialOccasion?: string
  onSubmit: (data: BookingFormData) => void
  isSubmitting?: boolean
}

export default function BookingForm({ initialOccasion = '', onSubmit, isSubmitting = false }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    fromName: '',
    fromEmail: '',
    recipientName: '',
    occasion: initialOccasion,
    instructions: '',
    deliveryDate: '',
    isPublic: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})

  const occasions = [
    'Birthday',
    'Anniversary',
    'Congratulations',
    'Motivation',
    'Get Well Soon',
    'Thank You',
    'Just Because',
    'Other',
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {}

    if (!formData.fromName.trim()) {
      newErrors.fromName = 'Your name is required'
    }

    if (!formData.fromEmail.trim()) {
      newErrors.fromEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.fromEmail)) {
      newErrors.fromEmail = 'Please enter a valid email'
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required'
    }

    if (!formData.occasion) {
      newErrors.occasion = 'Please select an occasion'
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Please provide instructions for the video'
    } else if (formData.instructions.trim().length < 10) {
      newErrors.instructions = 'Instructions should be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof BookingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* From (Your Info) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Your Name
        </label>
        <input
          type="text"
          value={formData.fromName}
          onChange={(e) => updateField('fromName', e.target.value)}
          placeholder="Enter your name"
          className={`w-full bg-black border ${
            errors.fromName ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500`}
        />
        {errors.fromName && (
          <p className="text-red-500 text-sm mt-1">{errors.fromName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Your Email
        </label>
        <input
          type="email"
          value={formData.fromEmail}
          onChange={(e) => updateField('fromEmail', e.target.value)}
          placeholder="your@email.com"
          className={`w-full bg-black border ${
            errors.fromEmail ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500`}
        />
        {errors.fromEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.fromEmail}</p>
        )}
        <p className="text-neutral-500 text-sm mt-1">We'll send the video to this email</p>
      </div>

      {/* Recipient */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Users className="w-4 h-4 inline mr-2" />
          Who is this for?
        </label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => updateField('recipientName', e.target.value)}
          placeholder="Recipient's name or 'myself'"
          className={`w-full bg-black border ${
            errors.recipientName ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500`}
        />
        {errors.recipientName && (
          <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
        )}
      </div>

      {/* Occasion */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Occasion
        </label>
        <select
          value={formData.occasion}
          onChange={(e) => updateField('occasion', e.target.value)}
          className={`w-full bg-black border ${
            errors.occasion ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500`}
        >
          <option value="">Select an occasion</option>
          {occasions.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
        {errors.occasion && (
          <p className="text-red-500 text-sm mt-1">{errors.occasion}</p>
        )}
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Instructions for the video
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => updateField('instructions', e.target.value)}
          placeholder="Tell us what you'd like them to say in the video. Be specific! Include names, inside jokes, or special messages."
          rows={5}
          className={`w-full bg-black border ${
            errors.instructions ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none`}
        />
        {errors.instructions && (
          <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>
        )}
        <p className="text-neutral-500 text-sm mt-1">
          {formData.instructions.length}/500 characters
        </p>
      </div>

      {/* Optional Delivery Date */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Delivery Date (Optional)
        </label>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => updateField('deliveryDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
        />
        <p className="text-neutral-500 text-sm mt-1">
          Leave blank for ASAP delivery
        </p>
      </div>

      {/* Public Video Toggle */}
      <div className="flex items-start gap-3 p-4 bg-neutral-900 rounded-lg">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => updateField('isPublic', e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="isPublic" className="flex-1 text-sm">
          <span className="font-medium block mb-1">Make video public</span>
          <span className="text-neutral-400">
            Allow this video to be featured on talent's profile (you can opt-out anytime)
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </button>

      <p className="text-center text-sm text-neutral-500">
        You won't be charged until the video is delivered
      </p>
    </form>
  )
}
