import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const adminEmail = "admin@web.lk";
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    
    // Check if the super admin already exists
    let superAdmin = await User.findOne({ email: adminEmail });

    if (!superAdmin) {
      superAdmin = await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: adminPassword,
        role: "super-admin",
        verificationStatus: "fully-verified"
      });
      return NextResponse.json({ 
        success: true, 
        message: `Super Admin account ${adminEmail} created successfully.` 
      });
    } else {
      superAdmin.role = "super-admin";
      superAdmin.password = adminPassword;
      await superAdmin.save();
      return NextResponse.json({ 
        success: true, 
        message: `Account ${adminEmail} updated to super-admin successfully.` 
      });
    }
  } catch (error: any) {
    console.error("Error seeding super admin:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
