import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.log("Usage: pnpm db:seed-admin <email> <password> [name]");
    console.log(
      "Example: pnpm db:seed-admin admin@vertical.family mypassword 'Admin User'"
    );
    process.exit(1);
  }

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  console.log(`Creating admin user: ${email}`);
  console.log(`Using auth URL: ${baseUrl}`);

  try {
    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message?.includes("already exists") || data.code === "USER_ALREADY_EXISTS") {
        console.log("❌ User with this email already exists");
        console.log("   To reset, delete the user from the database and try again.");
      } else {
        console.log("❌ Failed to create user:", data.message || data);
      }
      process.exit(1);
    }

    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
