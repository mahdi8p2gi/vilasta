import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Mock authentication — accepts email/password and returns a user session.
 * In production this would verify hashed passwords and issue a JWT.
 * For the demo we accept any of the seeded accounts or create a session
 * for the supplied email.
 */
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return error("ایمیل و رمز عبور الزامی است", 400);

  // Find a seeded user with this email
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return error("حساب کاربری با این ایمیل یافت نشد", 404);
  }

  // Demo: accept any password for seeded accounts
  return json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
    createdAt: user.createdAt,
  });
}
