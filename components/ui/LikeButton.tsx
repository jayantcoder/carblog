'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLikes: number;
  postId: number;
}

export default function LikeButton({ initialLikes, postId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        isLiked
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}