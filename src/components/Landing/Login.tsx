'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.post('/api/auth/login',{
        email,password
      })

         if (response.status == 200) {
          router.push('/dashboard');
      } else {
        setError(response.data.error || 'An error occurred during login. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'An error occurred during login. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 border border-gray-200 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="email" className="font-medium">Email</label>
            <input 
              id="email" 
              type="email" 
              className="border border-gray-300 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="password" className="font-medium">Password</label>
            <input 
              id="password" 
              type="password"
              className="border border-gray-300 p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-between mt-6">
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
