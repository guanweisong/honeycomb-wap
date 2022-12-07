FROM node:16-alpine AS Builder

WORKDIR /usr/src/h5
COPY package.json yarn.lock /usr/src/h5/

RUN yarn
COPY . .
RUN yarn build

FROM node:16-alpine
WORKDIR /usr/src/h5

COPY --from=builder /usr/src/h5 .

EXPOSE 3000
CMD npm start
