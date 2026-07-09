import { Kalam } from 'next/font/google'

// A hand-lettered font, scoped to /fable only, for the Excalidraw-style analogy
// sketches. Exposed as a CSS variable so the sketch <text> elements can opt in
// without changing the rest of the site's Inter/Poppins typography.
const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sketch',
  display: 'swap',
})

export default function FableLayout({ children }: { children: React.ReactNode }) {
  return <div className={kalam.variable}>{children}</div>
}
