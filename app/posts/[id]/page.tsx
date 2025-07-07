import Image from 'next/image';
import { ArrowLeft, User, Mail, Calendar, Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarSpecs from '@/components/car/CarSpecs';
import BackButton from '@/components/ui/BackButton';
import RatingStars from '@/components/ui/RatingStars';
import LikeButton from '@/components/ui/LikeButton';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface PostWithAuthor extends Post {
  author: User;
}

const categories = [
  { id: 'electric', name: 'Electric', color: 'bg-green-600' },
  { id: 'suv', name: 'SUV', color: 'bg-blue-600' },
  { id: 'luxury', name: 'Luxury', color: 'bg-purple-600' }
];

// Generate static params for the first 30 posts
export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

// Generate consistent car image URL based on post ID
const getCarImageUrl = (id: number) => {
  const carImages = [
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'
  ];
  return carImages[(id - 1) % carImages.length];
};

async function fetchPostWithAuthor(postId: string): Promise<PostWithAuthor | null> {
  try {
    const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      next: { revalidate: 3600 }
    });
    
    if (!postResponse.ok) {
      return null;
    }

    const postData: Post = await postResponse.json();
    
    const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`, {
      next: { revalidate: 3600 }
    });
    
    if (!userResponse.ok) {
      return null;
    }

    const userData: User = await userResponse.json();

    return {
      ...postData,
      author: userData
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await fetchPostWithAuthor(params.id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BackButton />
          <div className="text-center mt-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
            <p className="text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const postCategory = categories[post.id % categories.length];
  const postRating = 3.5 + (post.id % 3) * 0.5;
  const postLikes = 15 + (post.id * 7) % 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={getCarImageUrl(post.id)}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Back Button Overlay */}
        <div className="absolute top-8 left-8">
          <BackButton variant="overlay" />
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`${postCategory.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {postCategory.name}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              A Review Of Cars With Advanced Infotainment Systems
            </h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>December 15, 2024</span>
              </div>
              <RatingStars rating={postRating} size="sm" showNumber={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Article Actions */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>124</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>32</span>
                </Button>
                <LikeButton initialLikes={postLikes} postId={post.id} />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <p className="text-gray-600 text-sm">{post.author.email}</p>
                </div>
              </div>
              <RatingStars rating={postRating} size="md" />
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-light">
                {post.body}
              </p>
              
              {/* Extended content for better reading experience */}
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  This comprehensive review covers all aspects of this remarkable vehicle, from its cutting-edge technology 
                  to its impressive performance capabilities. We've spent extensive time testing this car in various 
                  conditions to bring you the most accurate and detailed analysis.
                </p>
                
                <p>
                  The design philosophy behind this vehicle represents a perfect blend of form and function. Every curve, 
                  every line has been carefully crafted to not only please the eye but also enhance aerodynamic efficiency. 
                  The attention to detail is evident in every aspect of the vehicle's construction.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Performance & Handling</h2>
                <p>
                  Behind the wheel, this car delivers an exceptional driving experience that balances comfort with 
                  performance. The suspension system has been tuned to provide optimal handling while maintaining 
                  ride quality that passengers will appreciate on long journeys.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Technology & Features</h2>
                <p>
                  The technological features integrated into this vehicle represent the latest in automotive innovation. 
                  From advanced safety systems to cutting-edge infotainment, every system has been designed with the 
                  user experience in mind.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Final Verdict</h2>
                <p>
                  After extensive testing and evaluation, this vehicle stands out as an excellent choice for drivers 
                  seeking a perfect balance of performance, technology, and value. The combination of innovative features 
                  and reliable engineering makes it a compelling option in today's competitive automotive market.
                </p>
              </div>
            </div>
          </div>

          {/* Car Specifications */}
          <div className="p-8 bg-gray-50">
            <CarSpecs postId={post.id} />
          </div>

          {/* Related Articles */}
          <div className="p-8 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={getCarImageUrl(post.id + 1)}
                    alt="Related article"
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Top 5 Electric Cars of 2024</h4>
                  <p className="text-sm text-gray-600">Comprehensive guide to the best EVs</p>
                  <RatingStars rating={4.5} size="sm" showNumber={false} />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={getCarImageUrl(post.id + 2)}
                    alt="Related article"
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Luxury SUV Comparison</h4>
                  <p className="text-sm text-gray-600">Premium SUVs head-to-head</p>
                  <RatingStars rating={4.8} size="sm" showNumber={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}