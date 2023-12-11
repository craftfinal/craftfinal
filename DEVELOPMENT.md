# Development of CraftFinal

CraftFinal is based on Next.js 14 and requires a PostgreSQL database to run.

## Getting Started

In a nutshell, running the app requires five steps

1. **Database:** Deploy a PostgreSQL database (version 14 or later) and obtain the connection strings for development and production.
2. **Authentication:** Create an account with _[Clerk Auth](https://clerk.com/)_
3. **Environment:** Create a local environment file, `.env.local` that provides access to the database and authentication provider
4. Run the development server
5. Deploy

Here's how to execute these steps one by one.

### 1. Set up the **Database**

There are many ways to get a PostgreSQL database (version 14 or later) up and running. If you are familiar with _Docker_, you may want to simply adapt the `docker-compose.yml` file in `docker/development/docker-compose.yml`.

Once you have the database up and running, obtain the [connection strings](https://www.postgresql.org/docs/14/libpq-connect.html#LIBPQ-CONNSTRING) for development and production. See section _34.1.1.2. Connection URIs_ in the linked documentation from PostgreSQL.

```zsh
postgresql://[userspec@][hostspec][/dbname][?paramspec]
```

where userspec is `user[:password]`, hostspec is `[host][:port][,...]` and paramspec is `name=value[&...]`.

The URI scheme designator can be either `postgresql://` or `postgres://`. Each of the remaining URI parts is optional. The following examples illustrate valid URI syntax:

```zsh
postgresql://user:password@localhost
```

```zsh
# Use environment variables from your deployed PostgreSQL (version 14) database
POSTGRES_PRISMA_URL="postgresql://user:password@localhost/craftfinal"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost/craftfinal"
```

### 2. Set up **authentication**

Visit _[Clerk Auth](https://clerk.com/)_ at [https://clerk.com/](https://clerk.com/) and create an account. Follow the instructions to obtain the development environment variables.

The environment variables at the time of writing look as follows (with the account-specific bits redacted):

```zsh
# Clerk Auth [clerk.com](https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<REDACTED>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_PROFILE_URL=/user-profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=http://localhost:3000/playground
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=http://localhost:3000/playground
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=http://localhost:3000/
CLERK_SECRET_KEY=sk_test_<REDACTED>
```

### 3. Environment

Your environment file should now look as follows:

```zsh
# Use environment variables from your deployed PostgreSQL (version 14) database
POSTGRES_PRISMA_URL="postgresql://user:password@localhost/craftfinal"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost/craftfinal"
# Clerk Auth [clerk.com](https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<REDACTED>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_PROFILE_URL=/user-profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=http://localhost:3000/playground
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=http://localhost:3000/playground
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=http://localhost:3000/
CLERK_SECRET_KEY=sk_test_<REDACTED>
```

### 4. Run the **development server**

To run the development server, use

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Customize environment for deployment to a custom domain

If you would like to deploy CraftFinal to your own domain, you may specifiy the app's name, domain and URL in the environment, as follows:

```zsh
NEXT_PUBLIC_CRAFTFINAL_APP_NAME=craftfinal.com
NEXT_PUBLIC_CRAFTFINAL_APP_DOMAIN=craftfinal.com
NEXT_PUBLIC_CRAFTFINAL_APP_DESCRIPTION="Craft the next final version"
NEXT_PUBLIC_CRAFTFINAL_APP_URL="https://craftfinal.com"
```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details regarding deployment to Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
