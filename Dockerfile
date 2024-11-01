FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma generate

CMD ["yarn", "start"]
