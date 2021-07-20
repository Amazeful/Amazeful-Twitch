FROM node:lts

WORKDIR /home/Amazeful-Twitch
COPY ["package.json", "yarn.lock"]
RUN yarn install

CMD ["yarn", "start"]
