import dbConnect from "@/lib/db";

import { verifyJwtToken } from "@/lib/jwt";

import Post from "@/models/Post";

export async function PUT(req, ctx) {
  await dbConnect();

  const id = ctx.params.id;

  try {
    const post = await Post.findById(id);

    if (post.likes.includes(decodedToken._id)) {
      post.likes = post.likes.filter((id) => id.toString());
    } else {
      post.likes.push(decodedToken._id);
    }

    await post.save();

    return new Response(
      JSON.stringify({ msg: "Successfully interacted with the post" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
