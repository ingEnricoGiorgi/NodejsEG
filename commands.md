docker build -t esercizio-node-app .
npm init -y          # crea package.json
npm install express
npm install jsonwebtoken

docker-compose up --build

http://localhost:8080/
http://localhost:3000/
docker-compose down
porto