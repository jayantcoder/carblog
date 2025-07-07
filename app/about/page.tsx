import { Car, Users, Zap, Award } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Car,
      title: 'Comprehensive Reviews',
      description: 'In-depth analysis of the latest car models, from luxury vehicles to everyday commuters.'
    },
    {
      icon: Zap,
      title: 'Electric Vehicle Focus',
      description: 'Stay ahead with our extensive coverage of EVs, charging infrastructure, and sustainable transport.'
    },
    {
      icon: Users,
      title: 'Expert Community',
      description: 'Connect with automotive enthusiasts and industry experts sharing their knowledge and experiences.'
    },
    {
      icon: Award,
      title: 'Trusted Insights',
      description: 'Reliable information to help you make informed decisions about your next vehicle purchase.'
    }
  ];

  const techStack = [
    'Next.js 13+ with App Router',
    'React 18 with TypeScript',
    'Tailwind CSS for styling',
    'ShadCN/UI component library',
    'JSONPlaceholder API integration',
    'Responsive design principles'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About JoyCars
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted source for automotive insights, reviews, and industry trends. 
          We're passionate about cars and committed to helping you stay informed.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            At A, we believe that choosing the right vehicle shouldn't be overwhelming. 
            Our mission is to provide clear, honest, and comprehensive automotive content that 
            empowers you to make confident decisions. Whether you're interested in the latest 
            electric vehicles, need maintenance tips, or want to stay updated on industry trends, 
            we've got you covered.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          What We Cover
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <feature.icon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Topics We Explore
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Electric Vehicles</h3>
            <p className="text-gray-600">Latest EV models, charging solutions, and sustainability insights</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SUV Reviews</h3>
            <p className="text-gray-600">Comprehensive reviews of family-friendly and luxury SUVs</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Tips</h3>
            <p className="text-gray-600">Expert advice on keeping your vehicle in top condition</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Trends</h3>
            <p className="text-gray-600">Analysis of automotive market trends and future predictions</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Cars</h3>
            <p className="text-gray-600">In-depth looks at high-end vehicles and premium features</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Options</h3>
            <p className="text-gray-600">Affordable vehicles that don't compromise on quality</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Built With Modern Technology
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          This blog is built using cutting-edge web technologies to ensure a fast, 
          responsive, and user-friendly experience across all devices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {techStack.map((tech, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}