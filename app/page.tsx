
import React from 'react'
import { AppBar } from '../components/Landing/AppBar';
import { Mainpage } from '@/components/Landing/Mainpage';
import { Footer } from '@/components/Landing/Footer';


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-grow">
        <Mainpage />
      </main>
      <Footer />
    </div>
  )
}