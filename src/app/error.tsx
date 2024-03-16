'use client' 
 
import { useEffect } from 'react';
import EmptyState from './components/Misc/EmptyState';
import toast from 'react-hot-toast';
 
export default function Error({error,reset,}: {
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