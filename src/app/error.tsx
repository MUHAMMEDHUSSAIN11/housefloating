'use client' 
 
import { useEffect } from 'react'
import { toast } from 'sonner'
import EmptyState from './components/Misc/EmptyState'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    toast.error("Something Went Wrong!")
  }, [error])
 
  return (
    <div className='pt-28 text-lg'>
     <EmptyState title='Something Went Wrong' subtitle='Refresh' showReset />
    </div>
  )
}