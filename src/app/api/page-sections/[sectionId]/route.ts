import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
    params: Promise<{
        sectionId: string
    }>
}

// GET - Get single section
export async function GET(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { sectionId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const section = await prisma.pageSection.findUnique({
            where: { id: sectionId },
        })

        if (!section) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 })
        }

        if (section.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        return NextResponse.json(section)
    } catch (error) {
        console.error('Error fetching section:', error)
        return NextResponse.json(
            { error: 'Failed to fetch section' },
            { status: 500 }
        )
    }
}

// PUT - Update section
export async function PUT(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { sectionId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { sectionType, title, content, order, isVisible } = body

        // Verify section exists and belongs to user's company
        const existingSection = await prisma.pageSection.findUnique({
            where: { id: sectionId },
        })

        if (!existingSection) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 })
        }

        if (existingSection.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
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

        // Update section
        const section = await prisma.pageSection.update({
            where: { id: sectionId },
            data: {
                sectionType,
                title,
                content,
                order,
                isVisible,
            },
        })

        return NextResponse.json(section)
    } catch (error) {
        console.error('Error updating section:', error)
        return NextResponse.json(
            { error: 'Failed to update section' },
            { status: 500 }
        )
    }
}

// DELETE - Delete section
export async function DELETE(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { sectionId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify section exists and belongs to user's company
        const existingSection = await prisma.pageSection.findUnique({
            where: { id: sectionId },
        })

        if (!existingSection) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 })
        }

        if (existingSection.companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Delete section
        await prisma.pageSection.delete({
            where: { id: sectionId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting section:', error)
        return NextResponse.json(
            { error: 'Failed to delete section' },
            { status: 500 }
        )
    }
}
