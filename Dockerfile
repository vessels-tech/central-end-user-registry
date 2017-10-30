FROM mhart/alpine-node:6.5.0

WORKDIR /opt/central-end-user-registry
COPY src /opt/central-end-user-registry/src
COPY migrations /opt/central-end-user-registry/migrations
COPY config /opt/central-end-user-registry/config
COPY node_modules /opt/central-end-user-registry/node_modules
COPY package.json /opt/central-end-user-registry/package.json

RUN npm prune --production && \
  npm uninstall -g npm

EXPOSE 3001
CMD node src/server.js
