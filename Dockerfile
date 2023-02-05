FROM node:14-alpine AS deps

RUN apk add git python3 build-base pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev

WORKDIR /app

ADD package-lock.json package-lock.json
ADD package.json package.json

RUN apk update
RUN npm install -g npm@8.1
RUN npm ci
ADD . .

FROM deps AS built

ADD .env .

ENV NODE_ENV=production

RUN set -o allexport && . .env && set +o allexport && printenv && npm run build

FROM built AS serve
EXPOSE 80
CMD set -o allexport && . .env && set +o allexport && npm run serve

