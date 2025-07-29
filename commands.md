docker build -t esercizio-node-app .
npm init -y          # crea package.json
npm install express
npm install jsonwebtoken

docker-compose up --build 

http://localhost:8080/
http://localhost:3000/
docker compose up -d --build
porto
----------------------------------------
: l'immagine genera il container
🔄 Differenza tra immagine e container
Elemento	Descrizione breve	Quando eliminarlo?
🧱 Immagine	Una "fotografia" del progetto in un certo stato	Quando hai fatto modifiche al codice (es: server.js)
📦 Container	Un’istanza in esecuzione di quell’immagine	Quando vuoi riavviarlo o ripulire
-------------------
docker compose down
docker compose up -d --build

Questo fa:

Ferma e rimuove i container (down)

Ricostruisce le immagini (grazie a --build)

Avvia tutto con i file aggiornati (incluso server.js)

✅ Se usi solo docker run (non Compose):
Dopo aver modificato server.js:

bash
Copia
Modifica
docker stop nome-container
docker rm nome-container
docker build -t nome-immagine .
docker run -d -p 3000:3000 --name nuovo-container nome-immagine

docker-compose logs backend
