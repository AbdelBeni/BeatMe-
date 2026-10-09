import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export interface JwtPayload {
  userId: number;
  discordId: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as number,
      discordId: payload.discordId as string,
    };
  } catch {
    return null;
  }
}