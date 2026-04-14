import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>

        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />

        <Button className="w-full">Login</Button>
      </div>
    </div>
  );
}
