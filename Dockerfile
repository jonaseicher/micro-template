FROM node:18

WORKDIR /micro

COPY index.js ./

COPY package.json ./

COPY node_modules ./node_modules

CMD [ "node", "index.js" ]
