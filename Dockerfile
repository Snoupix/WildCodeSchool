FROM node:19-alpine
WORKDIR /home/rocky/wildcodeschool

COPY ./package.json ./
RUN npm install
COPY ./ .

RUN npm run build
ENV NODE_ENV=production

EXPOSE 3001

RUN npx prisma generate

#CMD ["npm", “run”, "start"]
CMD npm run start