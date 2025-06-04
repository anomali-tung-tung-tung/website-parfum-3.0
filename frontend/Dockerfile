FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=8080
EXPOSE 8080

# Untuk development, gunakan:
# CMD ["npm", "run", "dev"]

# Untuk production:
CMD ["node", "server.js"]