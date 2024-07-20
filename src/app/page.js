import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";

export async function fetchPosts() {
  try {
    const res = await fetch('http://localhost:3000/api/post', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const posts = await fetchPosts();

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
