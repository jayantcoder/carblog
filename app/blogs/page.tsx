'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SearchBar from '@/components/ui/SearchBar';
import CategoryFilter from '@/components/ui/CategoryFilter';
import Pagination from '@/components/ui/Pagination';
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
  category: string;
  rating: number;
  likes: number;
}

const categories = [
  { id: 'electric', name: 'Electric', color: 'bg-green-600' },
  { id: 'suv', name: 'SUV', color: 'bg-blue-600' },
  { id: 'luxury', name: 'Luxury', color: 'bg-purple-600' }
];

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
    'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  ];
  return carImages[(id - 1) % carImages.length];
};

const POSTS_PER_PAGE = 6;

export default function BlogsPage() {
  const [allPosts, setAllPosts] = useState<PostWithAuthor[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPostsWithAuthors = async () => {
      try {
        setLoading(true);
        
        const [postsResponse, usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const postsData: Post[] = await postsResponse.json();
        const usersData: User[] = await usersResponse.json();

        const usersMap = new Map(usersData.map(user => [user.id, user]));

        const postsWithAuthors: PostWithAuthor[] = postsData
          .slice(0, 30)
          .map(post => ({
            ...post,
            author: usersMap.get(post.userId) || { id: 0, name: 'Unknown', email: '' },
            category: categories[post.id % categories.length].id,
            rating: 3.5 + (post.id % 3) * 0.5,
            likes: 15 + (post.id * 7) % 100
          }));

        setAllPosts(postsWithAuthors);
        setFilteredPosts(postsWithAuthors);
      } catch (err) {
        setError('Unable to fetch car blogs. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsWithAuthors();
  }, []);

  useEffect(() => {
    let filtered = allPosts;

    // Apply search filter - search in title and category
    if (searchQuery) {
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = categories.find(cat => cat.id === post.category)?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || categoryMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, allPosts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingSpinner message="Loading blogs..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Hero car"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Journey<br />
                Your Car<br />
                Your Way
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-md">
                Explore our comprehensive collection of car reviews, industry insights, 
                and automotive trends to make informed decisions.
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium">
                Subscribe ↗
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                      alt="Car 1"
                      width={200}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-40 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                      alt="Car 2"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-40 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                      alt="Car 3"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-32 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                      alt="Car 4"
                      width={200}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <SearchBar onSearch={handleSearch} className="flex-1 max-w-md" />
            <div className="text-sm text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* All Posts Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">All posts</h2>
        
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {paginatedPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <article className="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-200 last:border-b-0">
                  <div className="lg:w-1/3">
                    <div className="relative h-64 lg:h-48 rounded-lg overflow-hidden">
                      <Image
                        src={getCarImageUrl(post.id)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs px-2 py-1 rounded-full text-white ${
                          categories.find(cat => cat.id === post.category)?.color
                        }`}>
                          {categories.find(cat => cat.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        A Review Of Cars With Advanced Infotainment Systems
                      </h3>
                      <RatingStars rating={post.rating} size="sm" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                        <span className="font-medium">{post.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>1 min read</span>
                      <span>•</span>
                      <span>Dec 2024</span>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      Discover the latest automotive technology and how modern infotainment systems 
                      are revolutionizing the driving experience with cutting-edge features and 
                      seamless connectivity options.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                        Read full article
                      </Button>
                      <LikeButton initialLikes={post.likes} postId={post.id} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}