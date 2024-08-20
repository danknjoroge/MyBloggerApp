import Link from 'next/link'
import React from 'react'

const Login = () => {
  return (
    <div className='flex space-x-4'>
  <Link
    href='/login'
    className='px-6 rounded-md text-white hover:bg-blue-500 hover:text-white transition-all duration-300'
  >
    Login
  </Link>
  <Link
    href='/register'
    className='px-6 rounded-md text-white hover:bg-primary hover:text-white transition-all duration-300'
  >
    Register
  </Link>
</div>

  )
}

export default Login
