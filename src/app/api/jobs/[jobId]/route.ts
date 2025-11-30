import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
    params: Promise<{
        jobId: string
    }>
}

// GET - Get single job
export async function GET(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { jobId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        // Verify ownership
        if (job.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error fetching job:', error)
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        )
    }
}

// PUT - Update job
export async function PUT(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { jobId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, location, jobType, department, isActive } = body

        // Verify job exists and belongs to user's company
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (existingJob.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Update job
        const job = await prisma.job.update({
            where: { id: jobId },
            data: {
                title,
                description,
                location,
                jobType,
                department: department || null,
                isActive,
            },
        })

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        )
    }
}

// DELETE - Delete job
export async function DELETE(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { jobId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify job exists and belongs to user's company
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (existingJob.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Delete job
        await prisma.job.delete({
            where: { id: jobId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        )
    }
}
