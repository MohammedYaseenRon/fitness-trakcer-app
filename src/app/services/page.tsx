import React from 'react';
import Image from 'next/image';
import { ServiceInfo } from '@/components/ServiceInfo';
import { Footer } from '@/components/Landing/Footer';


export default function ServicesPage() {
  return (
    <div className="h-screnn">
      <div className="w-full px-32 py-12 ">
        <Image
          src="/Assets/banner (2).png"
          alt="Fitness"
          width={100}
          height={100} 
          layout="responsive" 
          className="rounded-xl"
        />
      </div>
      <div className="text-center">
        <h1 className="text-2xl text-slate-900 font-frank">Why Choose Us?</h1>
        <p className="text-4xl text-slate-600 font-frank mt-2">Comprhensive<span className="text-blue-600"> Services</span></p>
      </div>
        <div className="px-32 py-12">
          <ServiceInfo />
        </div>
        <Footer />
    </div>
  );
}