# CrunchHTTP Backend

Making HTTP Requests at scale of Trillions Requests Per Second.

# Get Started

1. Build a docker container

```shell
docker build --pull -t bun-crunch-http .
```

2. Start Bun Server

```shell
docker run -d -p 3000:3000 --env-file ./.env.production --name crunch-http bun-crunch-http
```

## Local Development

1. Take a look at `.env.development` for local development environment variables

2. To start the development server run:

```bash
bun run dev
```

Open http://localhost:4000/ with your browser to see the result.
