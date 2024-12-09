"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Select");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (status === "loading") {
    return <p className="text-center text-5xl">Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return <p>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === "Select" || !title || !desc) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch(`/api/post`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          category,
          authorId: session?.user?._id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error Response:", errorData);
        throw new Error(
          `Error occurred: ${errorData.message || res.statusText}`
        );
      }

      const post = await res.json();
      toast.success("Post Created Successfully.");

      router.push(`/`);
    } catch (error) {
      toast.error("Error Creating The Post. Please Try Again");

      console.log(error);
    }
  };

  return (
    <section className="bg-gray-100 max-w-screen-sm m-auto p-8">
      <div className="text-center mb-20">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
          Create A Post
        </h1>
        <div className="flex mt-2 justify-center">
          <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full focus:outline-none p-2"
            placeholder="Title Your Work"
          />
        </div>
        <div>
          <ReactQuill
            value={desc}
            onChange={setDesc}
            className="w-full focus:outline-none mt-4"
            placeholder="Share Your Thoughts Here..."
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full focus:outline-none p-2 mt-4"
            required
          >
            <option value="Select" disabled>
              Select a Category
            </option>
            {categories.map((data) => (
              <option key={data._id} value={data.name}>
                {data.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          Post
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
