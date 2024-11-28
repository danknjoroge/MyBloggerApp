"use client";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/post?page=${page}&limit=10`);
      const data = await response.json();

      if (data.posts) {
        setPosts(data.posts);
        setTotalPages(data.totalPages || 1);
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

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const cookies = document.cookie;
    console.log("Cookies:", cookies);
  }, []);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

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
        {loading ? (
          <h2 className="text-center">Loading...</h2>
        ) : filteredPosts.length > 0 ? (
          <>
            <h3 className="border-1 bg-orange-300 border-primary px-6 mx-5 py-2 rounded-md text-white font-semibold hover:text-white transition-all duration-300 max-w-max">
              Featured Post
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <h3>NO POSTS FOUND</h3>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {currentPage > 1 && 
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-200 flex items-center  g-1"
        >
          <MdArrowBackIos />
          Previous Page
        </button>
        }
        <span>
          {/* Page {currentPage} of {totalPages} */}
        </span>
        {totalPages > currentPage &&
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-200 flex items-center g-1"
        >
          Next Page 
          <MdArrowForwardIos />
        </button>
}
      </div>
    </main>
  );
}
