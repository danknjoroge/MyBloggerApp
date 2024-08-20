import dbConnect from "@/lib/db";
import Comment from '@/models/Comment';

export async function POST(req){
    await dbConnect()

    try {
       const body = await req.json()
       
       let newComment = await Comment.create(body);

       return new Response(JSON.stringify(newComment), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify(null), {status: 500})
    }
}





