'use client';

import React from 'react'
import Heading from './Heading';
import Button from './Button';
import { useRouter } from 'next/navigation';
import * as NProgress from 'nprogress';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters",
  showReset }) => {

  const router = useRouter();

  const handlePush = () => {
    router.push('/');
    NProgress.start();
    NProgress.done();
  };
  
  return (
    <div
      className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button outline label="Remove all filters" onClick={() => handlePush} />
        )}
      </div>
    </div>
  );
}

export default EmptyState