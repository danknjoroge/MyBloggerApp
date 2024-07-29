import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <section>
    <div className="flex items-center bg-white">
  <div className="container   flex flex-col items-center justify-between px-6 mx-auto">
      <div className="flex flex-col">
          <h1 className="w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl">
              The Blog Spot
          </h1>
          <h2 className="w-full max-w-2xl py-4 mx-auto text-xl font-light text-center text-gray-500">
            A Place to come and share your thoughts, ideas, and meet new friends. Have a look around and tell us what you think!
          </h2>
      </div>
  </div>
</div>
    </section>
  )
}

export default Hero
