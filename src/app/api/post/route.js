import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { verifyJwtToken, verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    return new Response(
      JSON.stringify({ posts, totalPages: Math.ceil(totalPosts / limit) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}


export async function POST(req) {
  await dbConnect();

  const accessToken = req.headers.get("authorization");
  const token = accessToken?.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = verifyJwtToken(token);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 403,
    });
  }

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const newPost = await Post.create(body);
    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create post",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
