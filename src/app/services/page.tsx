import React from 'react';
import Image from 'next/image';
import { ServiceInfo } from '@/components/ServiceInfo';
import { Footer } from '@/components/Landing/Footer';


export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/Assets/banner (2).png"
              alt="Fitness"
              width={1200}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section Header */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            Comprehensive <span className="text-blue-600">Services</span>
          </p>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full" />
        </div>
      </section>

      {/* Services Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ServiceInfo />
        </div>
      </section>

      <Footer />
    </div>
  );
}