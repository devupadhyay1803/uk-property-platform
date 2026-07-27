import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — UK Property Platform',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {children}
    </div>
  );
}
