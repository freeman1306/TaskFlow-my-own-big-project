import { PageContainer } from '@/components/layout/page-container';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}
