import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const exerciseOptions = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
    headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Use an environment variable for the API key
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
    },
};

export default async function handler(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
        return NextResponse.json({ error: "Method not Allowded" }, { status: 405 });
    }

    try{
        const response = await axios.request(exerciseOptions);
        return NextResponse.json(response.data, { status: 200 });
    }catch(error){
        console.error("Api Error", error);
        return NextResponse.json({ true: "Failed to fetched data" },{ status: 500 });

    }
}