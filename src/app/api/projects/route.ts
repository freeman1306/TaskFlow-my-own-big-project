import { NextResponse } from 'next/server'
import { mockProjects } from '@/data/mock-projects'

export async function GET() {
  return NextResponse.json(mockProjects)
}
