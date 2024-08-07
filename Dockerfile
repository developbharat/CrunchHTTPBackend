# ===========================
# ====== TEST & BUILD =======
# ===========================
FROM oven/bun:alpine as build
WORKDIR /usr/src/app

# copy all files from project directory to container
COPY . .

# install all packages
RUN bun install --frozen-lockfile

# [optional] run tests & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run build

# ===========================
# ======  PRODUCTION  =======
# ===========================
FROM oven/bun:alpine AS release

WORKDIR /usr/src/app

# copy files from project directory to container image
COPY --from=build /usr/src/app/build ./build
COPY package.json .
COPY bun.lockb .

# Set Environment as production
ENV NODE_ENV=production

# install production packages
RUN bun install --frozen-lockfile --production

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "build/index.js" ]