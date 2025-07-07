'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
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

export default function Home() {
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
          .slice(0, 20)
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
    return <LoadingSpinner message="Loading car blogs..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const featuredPost = allPosts[0];
  const trendingPosts = allPosts.slice(1, 5);
  const newTechPosts = paginatedPosts.slice(0, 4);

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
                Discover the latest car reviews, electric vehicle insights, and automotive trends. 
                Your trusted source for making informed car decisions.
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Latest Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest Post */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest</h2>
            {featuredPost && (
              <Link href={`/posts/${featuredPost.id}`} className="group">
                <article className="bg-white rounded-lg overflow-hidden">
                  <div className="relative h-64 mb-6">
                    <Image
                      src={getCarImageUrl(featuredPost.id)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>By {featuredPost.author.name}</span>
                        <span>March 17, 2024</span>
                      </div>
                      <RatingStars rating={featuredPost.rating} size="sm" showNumber={false} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      A Review Of Cars With Advanced Infotainment Systems
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Discover the latest automotive technology and how modern infotainment systems 
                      are revolutionizing the driving experience with cutting-edge features.
                    </p>
                    <div className="flex items-center justify-between">
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                        Read more
                      </Button>
                      <LikeButton initialLikes={featuredPost.likes} postId={featuredPost.id} />
                    </div>
                  </div>
                </article>
              </Link>
            )}
          </div>

          {/* Trending Blogs */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Trending Blogs</h2>
              <Link href="/blogs" className="text-blue-600 hover:text-blue-700 font-medium">
                See all
              </Link>
            </div>
            <div className="space-y-6">
              {trendingPosts.map((post, index) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="group">
                  <article className={`p-4 rounded-lg ${index === 0 ? 'bg-red-500 text-white' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm space-x-4">
                        <span className={index === 0 ? 'text-white' : 'text-gray-500'}>
                          By {post.author.name}
                        </span>
                        <span className={index === 0 ? 'text-white' : 'text-gray-500'}>
                          Aug 25, 2023
                        </span>
                      </div>
                      <RatingStars 
                        rating={post.rating} 
                        size="sm" 
                        showNumber={false}
                      />
                    </div>
                    <h3 className={`font-bold group-hover:opacity-80 transition-opacity ${
                      index === 0 ? 'text-white text-lg' : 'text-gray-900'
                    }`}>
                      A Review Of Cars With Advanced Infotainment Systems
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        index === 0 ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <LikeButton initialLikes={post.likes} postId={post.id} />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Technology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Technology</h2>
          <Link href="/blogs" className="text-blue-600 hover:text-blue-700 font-medium">
            See all
          </Link>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No posts found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newTechPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={getCarImageUrl(post.id)}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${
                        categories.find(cat => cat.id === post.category)?.color
                      }`}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      A Review Of Cars With Advanced Infotainment Systems
                    </h3>
                    <div className="flex items-center justify-between">
                      <RatingStars rating={post.rating} size="sm" />
                      <LikeButton initialLikes={post.likes} postId={post.id} />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">{post.author.name}</div>
                        <div>Dec 2024 • 1 Min Read</div>
                      </div>
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

      {/* All Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600">
                Discover the latest insights and reviews in {category.name.toLowerCase()} vehicles.
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-2">TESTIMONIALS</h2>
              <h3 className="text-3xl font-bold mb-6">What people say about our blog</h3>
              <p className="text-gray-300 mb-8">
                Join thousands of car enthusiasts who trust our reviews and insights 
                to make informed automotive decisions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold">Jonathan Vallem</div>
                  <div className="text-gray-400">New York</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-8">
              <RatingStars rating={5} size="md" showNumber={false} />
              <p className="text-lg leading-relaxed mt-4">
                "This blog has been incredibly helpful in my car buying journey. 
                The detailed reviews and honest insights helped me choose the perfect 
                electric vehicle for my family."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}