import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { userRoles } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
    };

    if (!adminData.email || !adminData.password || !adminData.name) {
      console.error("Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in environment variables");
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin user already exists in database.");
      
      // Still promote to ADMIN if it exists but might have wrong role
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          role: userRoles.ADMIN,
          emailVerified: true,
        },
      });
      console.log("Admin promoted successfully (in case it existed but was not admin)!");
      return;
    }

    console.log(`Creating admin account for ${adminData.email}...`);

    // Use internal API to create user (handles password hashing)
    const result = await auth.api.signUpEmail({
      body: {
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
      },
    });

    if (!result) {
      console.error("Failed to create admin via auth API");
      return;
    }

    console.log("Admin created successfully:", result.user.email);

    // Promote user to ADMIN and verify email
    await prisma.user.update({
      where: { email: adminData.email },
      data: {
        role: userRoles.ADMIN,
        emailVerified: true,
      },
    });

    console.log("Admin promoted successfully!");
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

// Run the seed
seedAdmin();
