FROM node:18-alpine as client
WORKDIR /app/client
COPY client/package.json .
RUN npm install
COPY client .
RUN npm run build

FROM node:18-alpine
WORKDIR /app/staticServer
COPY staticServer/package.json .
RUN npm install
COPY staticServer .
COPY --from=client /app/client/build ./client
EXPOSE 80
CMD ["npm", "start"]
