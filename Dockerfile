# This Dockerfile directly runs a Node application, meaning we don't
# 	have to Install different dependencies.

FROM		node:20

WORKDIR	/app
COPY		package*.json ./
RUN		npm install
COPY		. .

CMD ["npm", "run", "dev"]
