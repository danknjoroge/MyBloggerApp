import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyJwtToken } from '@/lib/jwt';

export async function GET(req) {
    await dbConnect();
    try {
        const category = await Category.find();
        return new NextResponse(JSON.stringify(category), { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();

    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(" ")[1];

    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const body = await req.json();
        let newCategory = await Category.create(body);

        return new NextResponse(JSON.stringify(newCategory), { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
