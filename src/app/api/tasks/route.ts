import { NextResponse } from 'next/server'
import { mockTasks } from '@/data/mock-tasks'

export async function GET() {
  return NextResponse.json(mockTasks)
}
