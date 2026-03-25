import React, { useState, useEffect } from 'react';
import { Sprout, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'From Farm to Market',
      subtitle: 'Building trust through transparency',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    },
    {
      title: 'Traceable Produce',
      subtitle: 'Every harvest has a story',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    },
    {
      title: 'Empowering Farmers',
      subtitle: 'Connect directly with buyers',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d5f3f] via-[#3a7050] to-[#e8915f] flex flex-col">
      {/* Image Carousel */}
      <div className="relative flex-1 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            
            {/* Slide Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
              <h2 className="text-3xl font-bold text-center mb-2 animate-fadeIn">
                {slide.title}
              </h2>
              <p className="text-lg text-center text-white/90 animate-fadeIn">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="relative z-10 bg-white rounded-t-3xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-[#2d5f3f] rounded-full p-3">
            <Sprout className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Kilimo Trace
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Your trusted platform for traceable agricultural produce
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Full Traceability</p>
              <p className="text-xs text-gray-600">Track produce from farm to market</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Direct Connection</p>
              <p className="text-xs text-gray-600">Connect farmers, aggregators, and buyers</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Build Trust</p>
              <p className="text-xs text-gray-600">Verified quality and transparent pricing</p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-[#2d5f3f] to-[#3a7050] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Building trust from farm to market
        </p>
      </div>
    </div>
  );
}
