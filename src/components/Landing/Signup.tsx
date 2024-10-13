'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import axios from 'axios'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.post('/api/auth/signup', { name, email, password })

      if (response.status === 201) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError('Failed to sign in after account creation. Please try logging in.')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Failed to create account. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
  }
  
  const handleGoogleSignIn = () => {
    signIn('google');
  };

    

return (
        <div className="max-w-md mx-auto mt-8 border border-gray-200 shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <p className="text-gray-600 mb-6">Create a new account</p>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="font-medium">Name</label>
                <input 
                id="name" 
                className="border border-gray-300 p-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>
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
                type="button" 
                className="bg-transparent border border-gray-500 text-gray-500 py-2 px-4 rounded-md"
                onClick={() => router.push('/login')}
            >
                Login
            </button>
            <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
                Sign Up
            </button>
            </div>
            <div className="mt-4 text-center">
                <p className="text-gray-500">or</p>
                <button
                    onClick={() => signIn("google")}
                    className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-md mt-2"
                >
                    <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Logo.svg" // URL to Google logo
                    alt="Google logo"
                    className="h-5 w-5 mr-2" 
                    />
                    Sign In with Google
                </button>
            </div>

        </form>
        </div>
    )
}
