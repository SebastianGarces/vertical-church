import { config } from "dotenv";
config({ path: ".env.local" });

import { program } from "commander";
import { createAdminUser } from "./commands/create-admin-user";

program
  .name("vertical-cli")
  .description("CLI for Vertical Church website administration");

program
  .command("create-admin-user")
  .description("Create a new admin user")
  .requiredOption("-e, --email <email>", "User email")
  .option("-p, --password <password>", "User password (auto-generated if not provided)")
  .requiredOption("-n, --name <name>", "User name")
  .action(createAdminUser);

program.parse();
