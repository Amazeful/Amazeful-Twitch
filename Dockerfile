FROM node:lts

WORKDIR /home/Amazeful-Twitch
COPY ["package.json", "yarn.lock"]
RUN yarn install
COPY . .
CMD ["yarn", "start"]
