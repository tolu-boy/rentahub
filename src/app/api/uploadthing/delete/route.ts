import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized user", { status: 401 });
  const { imageKey } = await req.json();

  try {
    const res = utapi.deleteFiles(imageKey)
    return NextResponse.json(res)
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal server Error', {status:500})
  }
}
