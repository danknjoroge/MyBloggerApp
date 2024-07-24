"use client"
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching Posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log('posts',posts);

  return (
    <main className="max-w-screen-lg m-auto">
      <Hero />
      <div className="mt-8">
        {posts ? (
          <>
            {posts.length > 0 && <h3 className="border-1 bg-orange-300 border-primary px-6 py-2 rounded-md text-white font-semibold  hover:text-white transition-all duration-300 max-w-max">
                  Featured Post
              </h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.length > 0
                ? posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                : <h3>Post Will Be Loaded Soon</h3>}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-center text-red-500">Error Fetching Posts</h2>
          </>
        )}
      </div>
    </main>
  );
}
