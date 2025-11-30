import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - List all sections for company
export async function GET() {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sections = await prisma.pageSection.findMany({
            where: {
                companyId: session.user.companyId,
            },
            orderBy: {
                order: 'asc',
            },
        })

        return NextResponse.json(sections)
    } catch (error) {
        console.error('Error fetching sections:', error)
        return NextResponse.json(
            { error: 'Failed to fetch sections' },
            { status: 500 }
        )
    }
}

// POST - Create new section
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { sectionType, title, content, order, isVisible, companyId } = body

        // Verify company ownership
        if (companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Validate required fields
        if (!sectionType || !title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate JSON content
        try {
            JSON.parse(content)
        } catch (e) {
            return NextResponse.json(
                { error: 'Content must be valid JSON' },
                { status: 400 }
            )
        }

        const section = await prisma.pageSection.create({
            data: {
                sectionType,
                title,
                content,
                order: order || 1,
                isVisible: isVisible ?? true,
                companyId,
            },
        })

        return NextResponse.json(section, { status: 201 })
    } catch (error) {
        console.error('Error creating section:', error)
        return NextResponse.json(
            { error: 'Failed to create section' },
            { status: 500 }
        )
    }
}
