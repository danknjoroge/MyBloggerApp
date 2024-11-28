import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const newMessage = await Contact.create(body);

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const message = await Contact.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
