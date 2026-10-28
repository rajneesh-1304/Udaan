ARG NODE_IMAGE=node:20-alpine

# Base image
FROM $NODE_IMAGE AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]