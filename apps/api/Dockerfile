FROM node:alpine
LABEL maintainer="Natnael Mekonnen <it.natnael.mekonnen@gmail.com>"

ARG APP_HOME=/home/backend
ARG APP_PORT
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

WORKDIR $APP_HOME

COPY . .

RUN addgroup -S user && adduser -S user -G user
RUN chown -R user:user $APP_HOME
RUN chmod -R 755 $APP_HOME
RUN set -ex && apk --no-cache add sudo
RUN apk update && apk add bash curl

RUN yarn install --frozen-lockfile
RUN yarn build

RUN curl -sL https://sentry.io/get-cli/ | SENTRY_CLI_VERSION="2.32.1" sh
RUN sentry-cli sourcemaps inject --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} ./dist
RUN sentry-cli sourcemaps upload --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} ./dist

EXPOSE ${APP_PORT}
