'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Job {
    id?: string
    title: string
    description: string
    location: string
    jobType: string
    department: string
    isActive: boolean
}

interface JobFormProps {
    job?: Job
    companyId: string
}

export default function JobForm({ job, companyId }: JobFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<Job>({
        title: job?.title || '',
        description: job?.description || '',
        location: job?.location || '',
        jobType: job?.jobType || 'Full-time',
        department: job?.department || '',
        isActive: job?.isActive ?? true,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const url = job?.id
                ? `/api/jobs/${job.id}`
                : '/api/jobs'

            const method = job?.id ? 'PUT' : 'POST'

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

            // Redirect to jobs list
            router.push('/dashboard/jobs')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!job?.id) return

        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || 'Failed to delete job')
                setIsLoading(false)
                return
            }

            router.push('/dashboard/jobs')
            router.refresh()
        } catch (error) {
            setError('Failed to delete job')
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                />
            </div>

            {/* Location */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA or Remote"
                />
            </div>

            {/* Job Type & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                    </label>
                    <select
                        id="jobType"
                        name="jobType"
                        required
                        value={formData.jobType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                    </label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Engineering, Sales, Marketing"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={12}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="## About the Role&#10;&#10;We're looking for...&#10;&#10;### Responsibilities&#10;- Responsibility 1&#10;- Responsibility 2&#10;&#10;### Requirements&#10;- Requirement 1&#10;- Requirement 2"
                />
                <p className="mt-2 text-sm text-gray-500">
                    Supports Markdown formatting (##, ###, -, **)
                </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (visible on careers page)
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
                    {job?.id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                        >
                            Delete Job
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
                        {isLoading ? 'Saving...' : job?.id ? 'Update Job' : 'Create Job'}
                    </button>
                </div>
            </div>
        </form>
    )
}
