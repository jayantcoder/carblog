'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  variant?: 'default' | 'overlay';
}

export default function BackButton({ variant = 'default' }: BackButtonProps) {
  const router = useRouter();

  if (variant === 'overlay') {
    return (
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-8 hover:bg-gray-100"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  );
}