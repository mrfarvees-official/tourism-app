This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker CI/CD

This repo includes a GitHub Actions workflow at [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml).

- Pull requests and pushes run `npm test`, `npm run build`, and a Docker image build check.
- Pushes to `main` also deploy over SSH by running `docker compose --env-file .env.docker -f docker-compose.ip.yml up -d --build --remove-orphans` on the server.

Server requirements:

- The repository must already be cloned on the server at the path stored in the `SERVER_PATH` secret.
- A `.env.docker` file must exist in that server checkout.
- GitHub secrets required for deploy are `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`, `SSH_PORT` (optional, defaults to `22`), and `SERVER_PATH`.
