FROM node:10.15.3-alpine
USER root

WORKDIR /opt/central-end-user-registry

RUN apk add --no-cache make gcc g++ python libtool autoconf automake && \
  cd $(npm root -g)/npm && \
  apk add -U iproute2 && ln -s /usr/lib/tc /lib/tc && \
  apk add -U iptables && \
  npm install -g node-gyp tap-xunit tape

COPY package.json package-lock.json* /opt/central-end-user-registry/
RUN npm install
RUN npm uninstall -g npm

COPY server.sh /opt/central-end-user-registry/
RUN chmod +x /opt/central-end-user-registry/server.sh

COPY src /opt/central-end-user-registry/src
COPY migrations /opt/central-end-user-registry/migrations
COPY config /opt/central-end-user-registry/config
COPY seeds /opt/central-end-user-registry/seeds

EXPOSE 3001
CMD ["/opt/central-end-user-registry/server.sh"]
