import { prisma } from "../lib/prisma";
import { userRoles } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists!");
      return;
    }

    // Sign up via auth API
    const response = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Origin: "http://localhost:5000",
         },
        body: JSON.stringify(adminData),
      }
    );

    const result = await response.json();
    console.log("Sign-up result:", result);

    if (!response.ok) {
      console.error("Failed to create admin via auth API");
      return;
    }

    // Promote user to ADMIN
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
    process.exit(1); // optional: exit script on error
  }
}

// Run the seed
seedAdmin();