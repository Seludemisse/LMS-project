'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Link from 'next/link'
import { useRef } from 'react'

export default function WelcomePage() {
  const swiperRef = useRef<any>(null)

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="w-full max-w-3xl h-[90vh] rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center flex flex-col justify-between"
            style={{ backgroundImage: "url('/image4.jpg')" }}
          >
            <div className="bg-white/80 text-center py-8 mt-auto">
              <h2 className="text-2xl font-bold">Welcome to UniMate</h2>
              <p className="mt-2 text-gray-600">Better way to learn is calling You!</p>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center flex flex-col justify-between"
            style={{ backgroundImage: "url('/image5.jpg')" }}
          >
            <div className="bg-white/80 text-center py-8 mt-auto">
              <h2 className="text-2xl font-bold">Now!</h2>
              <p className="mt-2 text-gray-600">
                Find Yourself by Doing whatever You Do!
              </p>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center flex flex-col justify-between"
            style={{ backgroundImage: "url('/image7.jfif')" }}
          >
            <div className="bg-white/80 text-center py-8 mt-auto">
              <h2 className="text-2xl font-bold">
                Master Your University Journey with UniMate
              </h2>
              <p className="mt-2 text-gray-600">Stay Organized. Stay Ahead.</p>
              <Link href="/signup">
                <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                  Get Started →
                </button>
              </Link>
              <p className="mt-4 text-sm text-gray-700">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </SwiperSlide> 
      </Swiper>
    </div>
  )
}
