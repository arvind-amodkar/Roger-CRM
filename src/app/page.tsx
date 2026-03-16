import { redirect } from 'next/navigation'

export default function Home() {
  if (typeof window === 'undefined') {
    redirect('/login')
  }

  return null
}
