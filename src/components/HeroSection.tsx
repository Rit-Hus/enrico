
import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onStartClick: string
}

const HeroSection: React.FC<HeroProps> = ({ onStartClick }) => {
  const benefits = [
    'Expert guidance',
    'Resources & support',
    'Proven results'
  ];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                Start Your Company
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  With Confidence
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                Share your business idea with us and we'll help you turn it into reality. Get expert guidance, resources, and support to launch your startup today.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href={onStartClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Submit Your Idea
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Visuals */}
          <div className="mt-16 lg:mt-0 lg:w-1/2 relative">
            <div className="relative">
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
              
              <div className="relative w-full bg-white dark:bg-gray-800 p-2 rounded-[40px] shadow-2xl transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Launching a startup" 
                  className="rounded-[36px] object-cover w-full aspect-[4/3] grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
