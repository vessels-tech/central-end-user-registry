FROM node:10.15.3-alpine
USER root

WORKDIR /opt/central-end-user-registry

RUN apk add --no-cache -t git build-dependencies make gcc g++ python libtool autoconf automake \
  && cd $(npm root -g)/npm \
  && npm install -g node-gyp

COPY package.json package-lock.json* /opt/central-end-user-registry/
RUN npm install
RUN npm uninstall -g npm

RUN apk del build-dependencies || echo "Non fatal error - build-dependencies have already been deleted"

COPY server.sh /opt/central-end-user-registry/
RUN chmod +x /opt/central-end-user-registry/server.sh

COPY src /opt/central-end-user-registry/src
COPY migrations /opt/central-end-user-registry/migrations
COPY config /opt/central-end-user-registry/config

EXPOSE 3000
CMD node src/server.js
