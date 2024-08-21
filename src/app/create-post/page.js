'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'

const Createpost = () => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState("Sports")
  
    const { data: session, status } = useSession()
    const router = useRouter()
  
    if (status === 'loading') {
        return <p className='text-center text-5xl'>Loading...</p>
    }
  
    if (status === 'unauthenticated') {
        return <p>Access Denied</p>
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault()
  
        if(!title || !category || !desc){
            toast.error("All fields are required")
            return
        }
  
        try {
            const res = await fetch(`/api/post`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken}` 
                },
                method: 'POST',
                body: JSON.stringify({title,desc,category,authorId: session?.user?._id})
            })
  
            if(!res.ok){
                throw new Error("Error occurred")
            }
  
            const post = await res.json()
  
            router.push(`/`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="bg-gray-100 max-w-screen-sm m-auto p-8">
            <div className="text-center mb-20">
                <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">Create A Post</h1>
                <div className="flex mt-2 justify-center">
                    <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type='text' 
                        onChange={(e) => setTitle(e.target.value)} 
                        className='w-full focus:outline-none p-2' 
                        placeholder='Title Your Work'
                    />
                </div>
                <div>
                    <ReactQuill 
                        value={desc} 
                        onChange={setDesc} 
                        className='w-full focus:outline-none mt-4' 
                        placeholder='Share Your Thoughts Here...'
                    />
                </div>
                <div>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}  
                        className='w-full focus:outline-none p-2 mt-4'
                    >
                        <option value='Sports'>Sports</option>
                        <option value='Money'>Money</option>
                        <option value='News'>News</option>
                        <option value='Tech'>Tech</option>
                        <option value='Programming'>Programming</option>
                    </select>
                </div>
                <button
                    type='submit'
                    className='px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500 hover:text-white transition-all duration-300'
                >
                    Post
                </button>
            </form>
        </section>
    )
}

export default Createpost
