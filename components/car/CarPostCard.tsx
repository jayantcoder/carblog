import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import RatingStars from '@/components/ui/RatingStars';
import LikeButton from '@/components/ui/LikeButton';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  category?: string;
  rating?: number;
  likes?: number;
}

interface CarPostCardProps {
  post: Post;
}

const categories = [
  { id: 'electric', name: 'Electric', color: 'bg-green-600' },
  { id: 'suv', name: 'SUV', color: 'bg-blue-600' },
  { id: 'luxury', name: 'Luxury', color: 'bg-purple-600' }
];

export default function CarPostCard({ post }: CarPostCardProps) {
  const description = post.body.length > 100 
    ? post.body.substring(0, 100) + '...' 
    : post.body;

  // Generate consistent car image URL based on post ID
  const getCarImageUrl = (id: number) => {
    const carImages = [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ];
    return carImages[(id - 1) % carImages.length];
  };

  const postCategory = post.category ? categories.find(cat => cat.id === post.category) : categories[post.id % categories.length];

  return (
    <Link href={`/posts/${post.id}`} className="group">
      <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getCarImageUrl(post.id)}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {postCategory && (
            <div className="absolute top-3 left-3">
              <span className={`text-xs px-2 py-1 rounded-full text-white ${postCategory.color}`}>
                {postCategory.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
              A Review Of Cars With Advanced Infotainment Systems
            </h2>
            {post.rating && (
              <RatingStars rating={post.rating} size="sm" showNumber={false} />
            )}
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            Discover the latest automotive technology and how modern infotainment systems 
            are revolutionizing the driving experience.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>By {post.author.name}</span>
            </div>
            {post.likes && (
              <LikeButton initialLikes={post.likes} postId={post.id} />
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}