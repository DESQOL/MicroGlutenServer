#
# ---- Base ----
FROM node:12.14.0 AS base

#
# ---- Dependencies ----
FROM base AS dependencies
WORKDIR /tmp

COPY package*.json ./
RUN npm ci --only=production

RUN mv node_modules prod_node_modules
RUN npm ci

#
# ---- Build ----
FROM dependencies AS build

COPY . .
RUN npm run build

#
# ---- Setup ----
FROM build AS setup
WORKDIR /usr/src/app

COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/prod_node_modules ./node_modules
COPY --from=build /tmp/package*.json ./

#
# ---- Production ----
FROM setup AS production

# Expose the HTTP and HTTPS port
EXPOSE 80 443

# Run the process under the node, aka unprivileged, user
# USER node

CMD [ "/opt/wait-for-it.sh", "cache:6379", "--",  "/opt/wait-for-it.sh", "database:3306", "--", "node", "dist/server.js" ]
