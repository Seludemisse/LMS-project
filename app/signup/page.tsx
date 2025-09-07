'use client'

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit =async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: {
      name: FormDataEntryValue | null;
      phone: FormDataEntryValue | null;
      email: FormDataEntryValue | null;
      password: FormDataEntryValue | null;
    } = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      password: formData.get('password'),
    };
     try {
    const res = await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Signup failed');
    // Show success message
    setShowSuccess(true);
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }catch (error) {
    console.error(error);
    alert('Signup failed. Please try again.');
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        
        {showSuccess ? (
          <div className="text-center">
            <div className="text-green-600 text-xl font-semibold mb-4">
              ✓ Account Created Successfully!
            </div>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="w-full bg-gray-100 border text-black border-gray-300 py-2 px-4 rounded-md mb-4"
            required
          />
          
          <input
            type="tel"
            name="phone"
            placeholder="Enter Phone Number"
            className="w-full bg-gray-100 border text-black border-gray-300 py-2 px-4 rounded-md mb-4"
            required
          />
          
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
          
          <p className="text-center mb-4">
            Already have an account? <Link href="/login" className="text-green-500">Login</Link>
          </p>
          
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md">
            Create Account
          </button>
        </form>
        )}
      </div>
    </div>
  );
}