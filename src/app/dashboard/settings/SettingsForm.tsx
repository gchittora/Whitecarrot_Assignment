'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Company } from '@prisma/client'

interface SettingsFormProps {
    company: Company
}

export default function SettingsForm({ company }: SettingsFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: company.name,
        slug: company.slug,
        description: company.description || '',
        logoUrl: company.logoUrl || '',
        bannerUrl: company.bannerUrl || '',
        videoUrl: company.videoUrl || '',
        themeColor: company.themeColor || '#4F46E5',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        setSuccess(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/company/${company.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Something went wrong')
                setIsLoading(false)
                return
            }

            setSuccess(true)
            setIsLoading(false)

            // Refresh the page to show updated data
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., WhiteCarrot"
                />
            </div>

            {/* Company Slug */}
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Company URL Slug *
                </label>
                <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">yoursite.com/</span>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        required
                        pattern="[a-z0-9-]+"
                        value={formData.slug}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="whitecarrot"
                    />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Only lowercase letters, numbers, and hyphens. This is your careers page URL.
                </p>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="A brief description of your company..."
                />
                <p className="mt-1 text-sm text-gray-500">
                    This appears on your careers page hero section
                </p>
            </div>

            {/* Logo URL */}
            <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                </label>
                <input
                    type="url"
                    id="logoUrl"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                />
                {formData.logoUrl && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                            src={formData.logoUrl}
                            alt="Logo preview"
                            className="h-16 border border-gray-200 rounded p-2 bg-white"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Banner URL */}
            <div>
                <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image URL
                </label>
                <input
                    type="url"
                    id="bannerUrl"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/banner.jpg"
                />
                {formData.bannerUrl && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                            src={formData.bannerUrl}
                            alt="Banner preview"
                            className="w-full h-32 object-cover border border-gray-200 rounded"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Video URL */}
            <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL (YouTube)
                </label>
                <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-1 text-sm text-gray-500">
                    YouTube video to display on your careers page
                </p>
            </div>

            {/* Theme Color */}
            <div>
                <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Color
                </label>
                <div className="flex items-center space-x-4">
                    <input
                        type="color"
                        id="themeColor"
                        name="themeColor"
                        value={formData.themeColor}
                        onChange={handleChange}
                        className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={formData.themeColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, themeColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                        placeholder="#4F46E5"
                    />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Primary color for your careers page (hero section, buttons, etc.)
                </p>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Settings saved successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    )
}
