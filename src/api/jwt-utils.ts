import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";
import { JwtPayload, User, UserCredentials } from "../models/store-types.js";
import { Request } from "@hapi/hapi";

dotenv.config();
const cookiePassword = process.env.cookie_password as string;

export function createToken(user: User) {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, cookiePassword, options);
}

export function decodeToken(token: string) {
  const userInfo = { userId: "", email: "" };
  try {
    const decoded = jwt.verify(token, cookiePassword) as jwt.JwtPayload;
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e: any) {
    console.log(e.message);
  }
  return userInfo;
}

export async function validate(decoded: JwtPayload, request: Request): Promise<{ isValid: true, credentials: User } | { isValid: false }> {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
