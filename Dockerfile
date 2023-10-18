FROM node:18

WORKDIR /micro

COPY target/ ./

COPY package.json ./

COPY node_modules ./node_modules

CMD [ "node", "index.js" ]
