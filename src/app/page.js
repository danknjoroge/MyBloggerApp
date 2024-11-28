"use client";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post");
        const data = await response.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching Posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-screen-lg m-auto">
      <Hero />
      <div className="flex flex-row p-1 pl-2 rounded-md gap-4 items-center border border-gray-400 w-fit ml-6">
        <input
          type="text"
          placeholder="Search by Category or Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none"
        />
        <CiSearch size={20} />
      </div>
      <div className="mt-8">
        {filteredPosts ? (
          <>
            {filteredPosts.length > 0 && (
              <h3 className="border-1 bg-orange-300 border-primary px-6 mx-5 py-2 rounded-md text-white font-semibold hover:text-white transition-all duration-300 max-w-max">
                Featured Post
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <h3>NO POSTS FOUND</h3>
              )}
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
