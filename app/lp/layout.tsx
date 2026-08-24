import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-gray-900">{children}</div>
}
