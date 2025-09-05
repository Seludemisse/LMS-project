'use client'

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log({
      email,
      password,
      remember: formData.get('remember') === 'on',
    });

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ Store JWT in localStorage so AssignmentsPage can use it
        localStorage.setItem('token', data.token);

        // optional: store user info if needed
        localStorage.setItem('user', JSON.stringify(data.user));

        // redirect to Assignments page (or dashboard)
        router.push('/dashboard');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Page</h1>
        
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md mb-2 flex items-center justify-center">
          <span className="mr-2">G</span> Login with Google
        </button>
        
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md mb-4 flex items-center justify-center">
          <span className="mr-2">f</span> Login with Facebook
        </button>
        
        <div className="text-center text-gray-500 mb-4">or</div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="w-full bg-gray-100 border text-black border-gray-300 py-2 px-4 rounded-md mb-4"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full bg-gray-100 border text-black border-gray-300 py-2 px-4 rounded-md mb-4"
            required
          />
          
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-purple-600">
              <input type="checkbox" name="remember" className="mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-purple-600">Forgot Password?</a>
          </div>
          
          <p className="text-center mb-4">
            Don&apos;t have an account? <Link href="/signup" className="text-green-500">Sign up</Link>
          </p>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}