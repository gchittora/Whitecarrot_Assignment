'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageSection {
    id?: string
    sectionType: string
    title: string
    content: string
    order: number
    isVisible: boolean
}

interface SectionFormProps {
    section?: PageSection
    companyId: string
}

export default function SectionForm({ section, companyId }: SectionFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        sectionType: section?.sectionType || 'about_us',
        title: section?.title || '',
        content: section?.content || '',
        order: section?.order || 1,
        isVisible: section?.isVisible ?? true,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const url = section?.id
                ? `/api/page-sections/${section.id}`
                : '/api/page-sections'

            const method = section?.id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, companyId }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Something went wrong')
                setIsLoading(false)
                return
            }

            router.push('/dashboard/page-builder')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!section?.id) return

        if (!confirm('Are you sure you want to delete this section?')) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`/api/page-sections/${section.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || 'Failed to delete section')
                setIsLoading(false)
                return
            }

            router.push('/dashboard/page-builder')
            router.refresh()
        } catch (error) {
            setError('Failed to delete section')
            setIsLoading(false)
        }
    }

    // Get placeholder content based on section type
    const getPlaceholder = () => {
        switch (formData.sectionType) {
            case 'about_us':
            case 'life_at_company':
                return JSON.stringify({
                    text: "Your company description here...",
                    highlights: [
                        "Highlight 1",
                        "Highlight 2",
                        "Highlight 3"
                    ]
                }, null, 2)
            case 'benefits':
                return JSON.stringify({
                    benefits: [
                        { icon: "🏥", title: "Health Insurance", description: "Comprehensive coverage" },
                        { icon: "💰", title: "Competitive Salary", description: "Market-leading pay" },
                        { icon: "🏖️", title: "Flexible PTO", description: "Take time when you need it" }
                    ]
                }, null, 2)
            case 'values':
                return JSON.stringify({
                    values: [
                        { title: "Innovation", description: "We embrace new ideas" },
                        { title: "Integrity", description: "We do what's right" },
                        { title: "Collaboration", description: "We work together" }
                    ]
                }, null, 2)
            default:
                return '{}'
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Type */}
            <div>
                <label htmlFor="sectionType" className="block text-sm font-medium text-gray-700 mb-2">
                    Section Type *
                </label>
                <select
                    id="sectionType"
                    name="sectionType"
                    required
                    value={formData.sectionType}
                    onChange={handleChange}
                    disabled={!!section?.id} // Can't change type after creation
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                >
                    <option value="about_us">About Us</option>
                    <option value="life_at_company">Life at Company</option>
                    <option value="benefits">Benefits & Perks</option>
                    <option value="values">Company Values</option>
                </select>
                {section?.id && (
                    <p className="mt-1 text-sm text-gray-500">
                        Section type cannot be changed after creation
                    </p>
                )}
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., About WhiteCarrot"
                />
            </div>

            {/* Order */}
            <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order *
                </label>
                <input
                    type="number"
                    id="order"
                    name="order"
                    required
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Lower numbers appear first on the page
                </p>
            </div>

            {/* Content */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content (JSON) *
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={15}
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder={getPlaceholder()}
                />
                <p className="mt-2 text-sm text-gray-500">
                    Content must be valid JSON. See placeholder for format examples.
                </p>
            </div>

            {/* Visible */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isVisible"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700">
                    Visible on careers page
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t">
                <div>
                    {section?.id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                        >
                            Delete Section
                        </button>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isLoading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : section?.id ? 'Update Section' : 'Create Section'}
                    </button>
                </div>
            </div>
        </form>
    )
}
