'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import * as NProgress from 'nprogress';
import Heading from '../components/Misc/Heading';
import Button from '../components/Misc/Button';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const BoatsEmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle,
  showReset }) => {

  const router = useRouter();

  const handlePush = async () => {
    await router.push('/houseBoats');
    await NProgress.start();
    await NProgress.done();
  };

  return (
    <div
      className="flex flex-col items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button outline label="Refresh" onClick={handlePush} />
        )}
      </div>
    </div>
  );
}

export default BoatsEmptyState