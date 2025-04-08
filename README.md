# Connecting Prisma to Neon Database: Step-by-Step Guide

This guide walks you through the process of connecting [Prisma](https://www.prisma.io/) to a [Neon](https://neon.tech/) database, including setting up the connection string, configuring Prisma, and integrating the Neon serverless driver.

## Step 1: Establish a Basic Connection

To establish a basic connection from Prisma to Neon, follow these steps:

1.  **Retrieve your Neon connection string**

    - Go to your Neon Project Dashboard.
    - Click the **Connect** button.
    - Select a branch, a user, and the database you want to connect to.
    - Copy the connection string provided.

2.  **Update your Prisma schema**  
    Add the following lines to your `prisma/schema.prisma` file to define the data source and database URL:

    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    ```

3.  **Set up your environment variable**

    Add a [DATABASE_URL] variable to your .env file and set it to the Neon connection string you copied.

    #### Examples:

    ```.env
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"

    "Tip: We recommend adding ?sslmode=require to the end of the connection string for secure connections."

    ```

4.  **Migrate and Generate Prisma Client**

    Run the following commands to migrate your database and generate the Prisma Client:

    ```prisma
        npx prisma migrate dev --name "init"
        npx prisma generate

        Replace "init" with a meaningful name for your migration.

    ```

5.  **Install Required Packages**

        Install the Prisma adapter for Neon, the Neon serverless driver, and the [ws] (WebSocket) packages:

    ```npm packages
        npm install ws @prisma/adapter-neon @neondatabase/serverless

        npm install -D @types/ws

    ```

6.  **Update Your Prisma Client Instance**

        Create or update a [prisma/db.ts] file with the following code to configure the Prisma Client with the Neon serverless driver:

        ```typescript
            import ws from "ws";

            import { PrismaClient } from "@prisma/client";
            import { PrismaNeon } from "@prisma/adapter-neon";
            import { Pool, neonConfig } from "@neondatabase/serverless";

            const globalForPrisma = global as unknown as {
            prisma: PrismaClient;
            };

            neonConfig.webSocketConstructor = ws;

            const connectionString = `${process.env.DATABASE_URL}`;
            const pool = new Pool({ connectionString });
            const adapter = new PrismaNeon(pool);
            const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

            if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;

            export default prisma;

        ```

## Additional Resources

For more details, refer to the official documentation:

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
