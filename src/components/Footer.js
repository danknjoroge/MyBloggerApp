import React from 'react'
import {
  AiFillYoutube,
  AiFillInstagram,
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillAmazonCircle,
} from "react-icons/ai";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='bg-white pt-4 pb-8 xl:pt-8'>
      <div className='max-w-screen-lg px-4 mx-auto text-gray-400 xl:max-w-screen-xl sm:px-6 md:px-8'>
      <div className="pt-8 flex border-t border-gray-200 max-w-xs mx-auto items-center justify-between">
            <Link href="#">
            <AiFillAmazonCircle className="w-6 h-auto text-xl transition-colors duration-200 hover:text-gray-800" />

            </Link>
            <Link href="#">
            <AiFillTwitterCircle className="w-6 h-auto text-xl transition-colors duration-200 hover:text-gray-800" />

            </Link>
            <Link href="#">
            <AiFillFacebook className="w-6 h-auto text-xl transition-colors duration-200 hover:text-gray-800" />
            </Link>
            <Link href="#">
            <AiFillInstagram className="w-6 h-auto text-xl transition-colors duration-200 hover:text-gray-800" />

            </Link>
            <Link href="#">
            <AiFillYoutube className="w-6 h-auto text-xl transition-colors duration-200 hover:text-gray-800" />
            </Link>
        </div>
        <div className="text-center pt-10">
        <footer className=" text-black font-bold py-4 fw-bold">
        <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Daniel Njoroge. All rights reserved.
        </div>
        </footer>
        </div>
      </div>
    </footer>
  )
}

export default Footer