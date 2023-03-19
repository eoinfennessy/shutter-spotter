import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "@hapi/hapi";
import { db } from "../models/db.js";
import { JwtPayload, User } from "../types/schemas.js";

dotenv.config();
const cookiePassword = process.env.COOKIE_PASSWORD as string;

export function createToken(user: User) {
  const payload = {
    id: user._id,
    email: user.email,
    scope: user.scope,
  };
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, cookiePassword, options);
}

export function decodeToken(token: string) {
  try {
    const decoded = jwt.verify(token, cookiePassword) as jwt.JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      scope: decoded.scope,
    } as JwtPayload;
  } catch (e: any) {
    console.log(e.message);
  }
  return null;
}

export async function validate(decoded: JwtPayload, request: Request): Promise<{ isValid: true; credentials: User } | { isValid: false }> {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
