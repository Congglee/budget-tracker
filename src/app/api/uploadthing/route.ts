import { createRouteHandler } from "uploadthing/next";
import { NextResponse } from "next/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UTApi } from "uploadthing/server";
import { currentUser } from "@/lib/session";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export async function DELETE(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const newUrls: string[] = body.map((url: string) =>
      url.substring(url.lastIndexOf("/") + 1)
    );
    const utapi = new UTApi();
    await utapi.deleteFiles(newUrls);

    return NextResponse.json(
      { message: "Delete image file successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
