FROM node:8-alpine
COPY ./dist /app
WORKDIR /app
ENV NODE_ENV=production
ARG http_proxy=''
ARG https_proxy=''
RUN npm install --production
EXPOSE 3000
ENTRYPOINT npm run production
