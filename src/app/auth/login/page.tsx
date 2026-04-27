'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUserStore } from '@/store/user-store'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const setUser = useUserStore((s) => s.setUser)

  async function handleLogin() {
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }

    setUser({ email })
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleLogin} className="p-6 space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <Input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 ">{error}</p>}

      <Button type={'submit'} className="px-4 py-2 bg-blue-600 text-white rounded">
        Login
      </Button>
    </form>
  )
}
