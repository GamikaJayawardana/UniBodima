import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * One-time (idempotent) super-admin seeding endpoint.
 *
 * Security: this endpoint can create/reset the platform's highest-privilege
 * account, so it is gated behind a secret. Call it as:
 *   GET /api/admin/seed?secret=<ADMIN_SEED_SECRET>
 *
 * Set ADMIN_SEED_SECRET in your environment. If it is not set, a default of
 * "setup-boardingfor" is used so the very first deploy can bootstrap, but you
 * should set your own secret (or remove this route) before going live.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const providedSecret = url.searchParams.get("secret");
    const expectedSecret = process.env.ADMIN_SEED_SECRET || "setup-boardingfor";

    if (providedSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized. A valid ?secret= is required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const adminUsername = "admin-gamika";
    const adminEmail = "admin-gamika@boardingfor.me";
    const hashedPassword = await bcrypt.hash("admin@890", 10);

    // Match an existing account by username OR the reserved email.
    let superAdmin = await User.findOne({
      $or: [{ username: adminUsername }, { email: adminEmail }],
    });

    if (!superAdmin) {
      superAdmin = await User.create({
        name: "Gamika (Admin)",
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: "super-admin",
      });
      return NextResponse.json({
        success: true,
        message: `Super Admin '${adminUsername}' created. Log in with username 'admin-gamika'.`,
      });
    }

    superAdmin.name = superAdmin.name || "Gamika (Admin)";
    superAdmin.username = adminUsername;
    superAdmin.role = "super-admin";
    superAdmin.password = hashedPassword;
    await superAdmin.save();

    return NextResponse.json({
      success: true,
      message: `Super Admin '${adminUsername}' updated and password reset.`,
    });
  } catch (error: any) {
    console.error("Error seeding super admin:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
