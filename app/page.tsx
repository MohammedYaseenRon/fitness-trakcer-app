
import React from 'react'
import { AppBar } from '../components/Landing/AppBar';


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-grow">
        <h1>hello broo</h1>
      </main>
    </div>
  )
}