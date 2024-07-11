import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

interface KindeEventUserData {
  email: string;
  first_name: string;
  id: string;
  is_password_reset_requested: boolean;
  is_suspended: boolean;
  last_name: string;
  organizations: object[];
  phone: string | null;
  username: string | null;
}

interface KindeEvent extends JwtPayload {
  type?: string;
  data?: {
    user: KindeEventUserData;
  };
}

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const decoded = jwt.decode(token, { complete: true }) as {
      header: JwtHeader;
      payload: KindeEvent;
    };

    if (!decoded || !decoded.header) {
      throw new Error("Invalid token");
    }

    const { header } = decoded;
    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey) as KindeEvent;

    // Handle various events
    switch (event?.type) {
      case "user.authenticated":
        // handle user created event
        // e.g add user to database with event.data
        console.log(event.data);
        break;
      case "user.updated":
        // handle user updated event
        // e.g update database with event.data
        console.log(event.data);
        break;
      case "user.created":
        // handle user created event
        // e.g add user to database with event.data
        const { user } = event.data!;
        await prisma.user.create({
          data: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            avatar: `https://avatar.vercel.sh/${user.first_name}`,
          },
        });
        break;
      default:
        // other events that we don't handle
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, message: "Success" });
}
