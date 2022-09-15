This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Step 2: Set up Prisma and connect your PostgreSQL database
For the purpose of this guide, you'll use a free PosgtreSQL database hosted on Heroku. Follow the steps in this guide to create one.

Alternatively, you can also use a local PostgreSQL database. However, once you reach the deployment step of this guide, you'll need a hosted database so that it can be accessed from the application when it's deployed on Vercel.

Next, you will set up Prisma and connect it to your PostgreSQL database. Start by installing the Prisma CLI via npm:
```bash npm install prisma --save-dev ```

Now, you can use the Prisma CLI to bootstrap a basic Prisma setup using the following command:
```bash npx prisma init```

This command does two things:

    Creates a new directory called prisma containing a schema.prisma file – the Prisma schema. This file will contain your database connection variable and your database schema
    Creates a .env in the root directory of the project: A dotenv file to define the database connection URL and other sensitive info as environment variables

Open the .env file and replace the dummy connection URL with the connection URL of your PostgreSQL database. For example, if your database is hosted on Heroku, the URL might look as follows:

// .env
DATABASE_URL="postgresql://giwuzwpdnrgtzv:d003c6a604bb400ea955c3abd8c16cc98f2d909283c322ebd8e9164b33ccdb75@ec2-54-170-123-247.eu-west-1.compute.amazonaws.com:5432/d6ajekcigbuca9"

Step 3. Create your database schema with Prisma
In this step, you'll create the tables in your database using the Prisma CLI.

Add the following model definitions to your schema.prisma so that it looks like this:

```code
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        String     @default(cuid()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  String?
}

model User {
  id            String       @default(cuid()) @id
  name          String?
  email         String?   @unique
  createdAt     DateTime  @default(now()) @map(name: "created_at")
  updatedAt     DateTime  @updatedAt @map(name: "updated_at")
  posts         Post[]
  @@map(name: "users")
}
```

## Note: You're occasionally using `@map` and `@@map` to map some field and model names to different column and table names in the underlying database. This is because NextAuth.js has some specialrequirements for calling things in your database a certain way.

This Prisma schema defines two models, each of which will map to a table in the underlying database: User and Post. Notice that there's also a relation (one-to-many) between the two models, via the author field on Post and the posts field on User.

To actually create the tables in your database, you now can use the following command of the Prisma CLI:

``` bash npx prisma db push```

Environment variables loaded from /Users/nikolasburk/Desktop/nextjs-guide/blogr-starter/.env
Prisma schema loaded from prisma/schema.prisma

🚀  Your database is now in sync with your schema. Done in 2.10s

Congratulations, the tables have been created! Go ahead and add some initial dummy data using Prisma Studio. Run the following command:
``` bash npx prisma studio ```

## Step 3. Install and generate Prisma Client
Before you can access your database from Next.js using Prisma, you first need to install Prisma Client in your app. You can install it via npm as follows:
``` bash npm install @prisma/client ```
Because Prisma Client is tailored to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:
``` bash npx prisma generate ```
You'll use a single PrismaClient instance that you can import into any file where it's needed. The instance will be created in a prisma.ts file inside the lib/ directory. Go ahead and create the missing directory and file:

``` bash  mkdir lib && touch lib/prisma.ts ```
Now, add the following code to this file:

```
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```
Now, whenever you need access to your database you can import the prisma instance into the file where it's needed.
##Step 4. Update the existing views to load data from the database

Open pages/index.tsx and add the following code right below the existing import declarations:
```
// pages/index.tsx
import prisma from '../lib/prisma';

```
Your prisma instance will be your interface to the database when you want to read and write data in it. You can for example create a new User record by calling prisma.user.create() or retrieve all the Post records from the database with prisma.post.findMany(). For an overview of the full Prisma Client API, visit the Prisma docs.

Now you can replace the hardcoded feed object in getStaticProps inside index.tsx with a proper call to the database:
```
// index.tsx
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};
```
The two things to note about the Prisma Client query:

    A where filter is specified to include only Post records where published is true
    The name of the author of the Post record is queried as well and will be included in the returned objects

Before running the app, head over the to the /pages/p/[id].tsx and adjust the implementation there as well to read the correct Post record from the database.

This page uses getServerSideProps (SSR) instead of getStaticProps (SSG). This is because the data is dynamic, it depends on the id of the Post that's requested in the URL. For example, the view on route /p/42 displays the Post where the id is 42.

Like before, you first need to import Prisma Client on the page:
```
// pages/post/[id].tsx
import prisma from '../../lib/prisma';
```
Now you can update the implementation of getServerSideProps to retrieve the proper post from the database and make it available to your frontend via the component's props:
```
// pages/p/[id].tsx
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: post,
  };
};
```
That's it! If your app is not running any more, you can restart it with the following command:
``` bash
npm run dev
```


