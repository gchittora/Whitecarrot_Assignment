'use client'

import { useState, useMemo } from 'react'

interface Job {
    id: string
    title: string
    location: string
    jobType: string
    department: string | null
    createdAt: Date
}

interface JobsListProps {
    jobs: Job[]
    companySlug: string
}

export default function JobsList({ jobs, companySlug }: JobsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
    const [selectedLocation, setSelectedLocation] = useState<string>('all')
    const [selectedJobType, setSelectedJobType] = useState<string>('all')

    // Get unique values for filters
    const departments = useMemo(() => {
        const depts = jobs
            .map(job => job.department)
            .filter((dept): dept is string => dept !== null)
        return ['all', ...Array.from(new Set(depts)).sort()]
    }, [jobs])

    const locations = useMemo(() => {
        const locs = jobs.map(job => job.location)
        return ['all', ...Array.from(new Set(locs)).sort()]
    }, [jobs])

    const jobTypes = useMemo(() => {
        const types = jobs.map(job => job.jobType)
        return ['all', ...Array.from(new Set(types)).sort()]
    }, [jobs])

    // Filter jobs based on all criteria
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())

            // Department filter
            const matchesDepartment = selectedDepartment === 'all' ||
                job.department === selectedDepartment

            // Location filter
            const matchesLocation = selectedLocation === 'all' ||
                job.location === selectedLocation

            // Job type filter
            const matchesJobType = selectedJobType === 'all' ||
                job.jobType === selectedJobType

            return matchesSearch && matchesDepartment && matchesLocation && matchesJobType
        })
    }, [jobs, searchQuery, selectedDepartment, selectedLocation, selectedJobType])

    // Check if any filters are active
    const hasActiveFilters = searchQuery !== '' ||
        selectedDepartment !== 'all' ||
        selectedLocation !== 'all' ||
        selectedJobType !== 'all'

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('')
        setSelectedDepartment('all')
        setSelectedLocation('all')
        setSelectedJobType('all')
    }

    return (
        <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Open Positions
            </h2>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search jobs by title, department, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Department Filter */}
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Departments</option>
                        {departments.filter(d => d !== 'all').map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    {/* Location Filter */}
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Locations</option>
                        {locations.filter(l => l !== 'all').map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>

                    {/* Job Type Filter */}
                    <select
                        value={selectedJobType}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                        <option value="all">All Job Types</option>
                        {jobTypes.filter(t => t !== 'all').map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Active Filters & Clear Button */}
                {hasActiveFilters && (
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg mb-2">
                        No jobs found matching your criteria
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear filters to see all jobs
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {!hasActiveFilters && (
                        <p className="text-gray-600 mb-6">
                            {jobs.length} open position{jobs.length !== 1 ? 's' : ''}
                        </p>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredJobs.map((job) => (
                            <a
                                key={job.id}
                                href={`/${companySlug}/careers/jobs/${job.id}`}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-500"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                📍 {job.location}
                                            </span>
                                            <span className="flex items-center">
                                                💼 {job.jobType}
                                            </span>
                                            {job.department && (
                                                <span className="flex items-center">
                                                    🏢 {job.department}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}
