import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
    params: Promise<{
        companyId: string
    }>
}

// GET - Get company details
export async function GET(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { companyId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify ownership
        if (companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
        })

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 })
        }

        return NextResponse.json(company)
    } catch (error) {
        console.error('Error fetching company:', error)
        return NextResponse.json(
            { error: 'Failed to fetch company' },
            { status: 500 }
        )
    }
}

// PUT - Update company details
export async function PUT(request: Request, context: RouteContext) {
    try {
        const session = await auth()
        const { companyId } = await context.params

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify ownership
        if (companyId !== session.user.companyId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { name, slug, description, logoUrl, bannerUrl, videoUrl, themeColor } = body

        // Validate required fields
        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            )
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json(
                { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
                { status: 400 }
            )
        }

        // Check if slug is taken by another company
        if (slug !== (await prisma.company.findUnique({ where: { id: companyId } }))?.slug) {
            const existingCompany = await prisma.company.findUnique({
                where: { slug },
            })

            if (existingCompany && existingCompany.id !== companyId) {
                return NextResponse.json(
                    { error: 'This slug is already taken by another company' },
                    { status: 400 }
                )
            }
        }

        // Update company
        const company = await prisma.company.update({
            where: { id: companyId },
            data: {
                name,
                slug,
                description: description || null,
                logoUrl: logoUrl || null,
                bannerUrl: bannerUrl || null,
                videoUrl: videoUrl || null,
                themeColor: themeColor || '#4F46E5',
            },
        })

        return NextResponse.json(company)
    } catch (error) {
        console.error('Error updating company:', error)
        return NextResponse.json(
            { error: 'Failed to update company' },
            { status: 500 }
        )
    }
}
