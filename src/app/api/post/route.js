import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { verifyJwtToken, verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await dbConnect();
  try {
    const post = await Post.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(post), { status: 200 });
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
