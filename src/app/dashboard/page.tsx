'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user-store'

export default function DashboardPage() {
  const router = useRouter()

  const clearUser = useUserStore((s) => s.clearUser)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    clearUser()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-3xl font-bold">3</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">AI Insights</p>
          <p className="text-3xl font-bold">4</p>
        </div>
      </div>
    </div>
  )
}
