FROM node

# Path: /app
WORKDIR /app

COPY . .
EXPOSE 3000
RUN npm install

CMD ["npm","run","dev:start"]