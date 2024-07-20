import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <section>
    <div className="flex items-center bg-white">
  <div className="container   flex flex-col items-center justify-between px-6 py-8 mx-auto">
      <div className="flex flex-col">
          <h1 className="w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl">
              The Blog Spot
          </h1>
          <h2 className="w-full max-w-2xl py-8 mx-auto text-xl font-light text-center text-gray-500">
            A Place to come and share your thoughts, ideas, and meet new friends. Have a look around and tell us what you think!
          </h2>
          <div className="flex items-center justify-center mt-4 gap-x-5">
              <Link href="/" className="border-1 bg-orange-300 border-primary px-6 py-2 rounded-md text-white font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                  Featured Post
              </Link>
              <Link href="/" className="border-1 bg-orange-300 border-primary px-6 py-2 rounded-md text-white font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                  Our Users
              </Link>
              
          </div>
      </div>
  </div>
</div>
    </section>
  )
}

export default Hero
