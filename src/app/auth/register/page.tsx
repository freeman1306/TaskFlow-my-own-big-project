'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  async function handleRegister() {
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }
    router.push('/auth/login');
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Register</h1>

        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button className="w-full" onClick={handleRegister}>
          Create account
        </Button>
      </div>
    </div>
  );
}
