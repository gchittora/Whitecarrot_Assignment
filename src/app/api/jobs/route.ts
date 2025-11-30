import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - List all jobs for company
export async function GET() {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const jobs = await prisma.job.findMany({
            where: {
                companyId: session.user.companyId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(jobs)
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}

// POST - Create new job
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, location, jobType, department, isActive, companyId } = body

        // Verify company ownership
        if (companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Validate required fields
        if (!title || !description || !location || !jobType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                location,
                jobType,
                department: department || null,
                isActive: isActive ?? true,
                companyId,
            },
        })

        return NextResponse.json(job, { status: 201 })
    } catch (error) {
        console.error('Error creating job:', error)
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        )
    }
}
