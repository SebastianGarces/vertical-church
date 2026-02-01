import { randomBytes } from 'crypto';
import { z } from 'zod';

interface CreateAdminUserOptions {
  email: string;
  password?: string;
  name: string;
}

const emailSchema = z.string().email('Invalid email format');

function generatePassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const bytes = randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[bytes[i] % charset.length];
  }
  return password;
}

export async function createAdminUser(options: CreateAdminUserOptions) {
  const { email, name } = options;
  let { password } = options;
  const wasPasswordGenerated = !password;

  // Validate email
  const emailResult = emailSchema.safeParse(email);
  if (!emailResult.success) {
    console.error('Error: Invalid email format');
    process.exit(1);
  }

  // Generate password if not provided
  if (!password) {
    password = generatePassword();
  }

  const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

  console.log(`Creating admin user: ${email}`);
  console.log(`Using auth URL: ${baseUrl}`);

  try {
    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': baseUrl,
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();
    console.log('data', data);

    if (!response.ok) {
      if (data.message?.includes('already exists') || data.code === 'USER_ALREADY_EXISTS') {
        console.error('Error: User with this email already exists');
        console.error('  To reset, delete the user from the database and try again.');
      } else {
        console.error('Error: Failed to create user:', data.message || data);
      }
      process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${name}`);

    if (wasPasswordGenerated) {
      console.log(`  Generated password: ${password}`);
      console.log('  (Share this password securely with the user)');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.error('Error: Could not connect to the server.');
      console.error('  Make sure the dev server is running (pnpm dev)');
    } else {
      console.error('Error:', error);
    }
    process.exit(1);
  }

  process.exit(0);
}
