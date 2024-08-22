'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';


const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession()

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if(!name){
        toast.error("All fields are required")
        return
    }
  
    try {
      
      const res = await fetch(`/api/category`, {
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${session?.user?.accessToken}` 
        },
        method: 'POST',
        body: JSON.stringify({name})
      })
  
      if(!res.ok){
        throw new Error("Error occured")
      }
  
      const post = await res.json() 
      toast.success("Category Added Successfully") 
      router.push(`/create-post`)
    } catch (error) {
      toast.error("Category Already Exist.")
        console.log(error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
