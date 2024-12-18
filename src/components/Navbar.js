'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { signIn, signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: session } = useSession()
  const [navIsVisible, setNavIsVisible] = useState(false);

  const navVisibilityHandler = () => {
    setNavIsVisible((curState) => !curState);
  }

  const closeNav = () => {
    setNavIsVisible(false);
  }

  return (
    <header className='container mx-auto px-5 flex justify-between py-4 items-center z-50'>
      <div className='flex items-center gap-x-2 lg:gap-x- lg:flex-row'>
        <img src='/logo.png' alt='logo' className='w-10 h-10 lg:w-12 lg:h-12' />
        <Link href={'/'} className='text-primary text-xl font-bold  p-2 border-md transition-all duration-300'>
        THE MAJIRANI EXPERIENCE
        </Link>
      </div>
      <div className="lg:hidden z-50">
        {navIsVisible ? (
          <AiOutlineClose
            className="w-6 h-6"
            onClick={navVisibilityHandler}
          />
        ) : (
          <AiOutlineMenu
            className="w-6 h-6"
            onClick={navVisibilityHandler}
          />
        )}
      </div>
      <nav className={`${navIsVisible ? "right-0" : "right-full"}
        transition-all duration-300 mt-[56px] lg:mt-0 bg-primary align-bottom lg:bg-transparent flex-col w-full lg:w-auto lg:flex-row justify-center lg:justify-end fixed top-0 bottom-0 -right-full lg:static flex gap-x-9 items-center`}>
        <ul className='gap-y-5 items-center flex gap-x-5 flex-col lg:flex-row font-semibold lg:justify-end lg:w-full'>
          <li onClick={closeNav}>
            <Link className='text-orange-300 text-2xl font-bold  p-2 border-md hover:text-orange-700 transition-all duration-300' href={'/'}>
              Home
            </Link>
          </li>
          <li onClick={closeNav}>
            <Link className='text-orange-300 text-2xl font-bold  p-2 border-md hover:text-orange-700 transition-all duration-300' href={'/about'}>
              About
            </Link>
          </li>
          <li onClick={closeNav}>
            <Link className='text-orange-300 text-2xl font-bold  p-2 border-md hover:text-orange-700 transition-all duration-300' href={'/contact'}>
              Contact
            </Link>
          </li>
          {session?.user ? (
            <>
              {session.user.email === process.env.NEXT_PUBLIC_AUTHENTICATED_EMAIL && (
                <>
                  <li onClick={closeNav}>
                    <Link
                      href='/create-post'
                      className='px-6 py-2.5 rounded-md bg-primary text-white hover:bg-indigo-50 hover:text-indigo-500 transition-all duration-300'
                    >
                      Create Post
                    </Link>
                  </li>
                  <li onClick={closeNav}>
                    <Link
                      href='/categories'
                      className='px-6 py-2.5 rounded-md bg-primary text-white hover:bg-indigo-50 hover:text-indigo-500 transition-all duration-300'
                    >
                      Add Category
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={() => { signOut(); closeNav(); }}
                  className='px-6 py-2.5 rounded-md bg-indigo-50 text-indigo-500 hover:bg-primary hover:text-white transition-all duration-300'
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
