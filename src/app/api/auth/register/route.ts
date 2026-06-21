import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();
  if (!email || !password) return error("ایمیل و رمز عبور الزامی است", 400);

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return error("این ایمیل قبلاً ثبت شده است", 409);

  const user = await db.user.create({
    data: {
      email,
      password,
      name: name || email.split("@")[0],
      role: role || "customer",
    },
  });

  return json(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    201
  );
}
