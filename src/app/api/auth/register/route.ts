import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.string().min(2, "Please select a valid city"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => err.message).join(", ");
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    const { name, email, password, phone, city } = result.data;
    const lowerEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: lowerEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const newUser = await db.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashedPassword,
        phone,
        city,
        role: "MEMBER",
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
