'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const ComingSoonPage = () => {
  const pathname = usePathname();
  
  // Determine service details based on pathname
  const getServiceDetails = () => {
    if (pathname === '/shikaras') {
      return {
        title: 'Shikara Services',
        icon: '/images/Shikara_Icon.png',
        description: 'Experience the tranquil beauty of Alleppey backwaters with our traditional Shikara rides through the enchanting canals and lagoons of Kerala.',
        features: [
          'Traditional Kerala Shikaras',
          'Expert local boatmen',
          'Backwater canal tours',
          'Bird watching experiences',
          'Sunset & sunrise rides',
          'Village backwater exploration'
        ]
      };
    } else if (pathname === '/kayaks') {
      return {
        title: 'Kayak Adventures',
        icon: '/images/Kayak_Icon.png',
        description: 'Paddle through the serene backwaters of Alleppey with our premium kayak experiences, exploring hidden canals and pristine waterways.',
        features: [
          'Premium kayak equipment',
          'Safety gear included',
          'Backwater exploration tours',
          'Mangrove kayaking',
          'Beginner-friendly options',
          'Group & solo experiences'
        ]
      };
    }
    return {
      title: 'New Service',
      icon: '/images/HB_Icon.png',
      description: 'We are working on something amazing for you.',
      features: []
    };
  };

  const serviceDetails = getServiceDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-14 md:pt-0">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Service Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <Image
                src={serviceDetails.icon}
                alt={serviceDetails.title}
                width={120}
                height={120}
                className="relative rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {serviceDetails.title}
          </h1>
          
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold mb-8 shadow-lg">
            <Clock className="w-5 h-5 mr-2" />
            Coming Soon
          </div>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {serviceDetails.description}
          </p>

          {/* Timeline Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Launch Timeline</h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">Within few Weeks</div>
              <p className="text-gray-600">We're putting the finishing touches on this amazing service</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-semibold text-green-800 mb-1">✓ Planning Complete</div>
                <div className="text-green-600">Service design finalized</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="font-semibold text-yellow-800 mb-1">⚡ In Progress</div>
                <div className="text-yellow-600">Final preparations</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-semibold text-blue-800 mb-1">🚀 Coming Soon</div>
                <div className="text-blue-600">Ready to launch</div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          {serviceDetails.features.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-left p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6 opacity-90">
              Be the first to know when our {serviceDetails.title.toLowerCase()} become available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/houseBoats"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Explore Houseboats
              </Link>
              <Link 
                href="/"
                className="bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-300 transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;