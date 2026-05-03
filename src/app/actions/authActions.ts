"use server";

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

type MongoLookupError = {
  code?: string;
  syscall?: string;
  message?: string;
};

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Please provide all required fields." };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: "Email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error registering user:", error);

    const mongoError = error as MongoLookupError;

    if (
      (mongoError.code === "ECONNREFUSED" && mongoError.syscall === "querySrv") ||
      mongoError.message?.includes("querySrv")
    ) {
      return {
        success: false,
        error:
          "Database DNS lookup failed. Check internet/DNS access for MongoDB SRV, or set MONGODB_URI_FALLBACK in .env.local with a standard mongodb:// URI.",
      };
    }

    return { success: false, error: "An error occurred during registration." };
  }
}
