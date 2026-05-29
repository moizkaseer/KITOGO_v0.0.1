import type { Metadata } from 'next';
import LiveDashboard from './LiveDashboard';

export const metadata: Metadata = {
  title: 'Dashboard — KITOGO',
  description: 'Live AI agent call monitoring dashboard',
};

export default function DashboardPage() {
  return <LiveDashboard />;
}
