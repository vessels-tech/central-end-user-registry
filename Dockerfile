FROM mhart/alpine-node:6.5.0

WORKDIR /opt/central-end-user-registry
COPY src /opt/central-end-user-registry/src
COPY migrations /opt/central-end-user-registry/migrations
COPY config /opt/central-end-user-registry/config
COPY package.json /opt/central-end-user-registry/package.json

RUN apk add --no-cache make gcc g++ python
RUN npm install --production
RUN npm uninstall -g npm

EXPOSE 3001

CMD node src/server.js
