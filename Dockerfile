# base image
FROM node:latest

# set working directory
WORKDIR /app/notifications-api

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/notifications-api/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/notifications-api/package.json
RUN npm install

# wait for authentication api then start app
CMD ["/app/wait-for-it.sh", "authentication-api:3000", "--", "npm", "run", "start"]