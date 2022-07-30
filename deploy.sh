git pull
docker build -t pikky-app .
docker stop pikky-app
docker rm pikky-app
docker run -d --name pikky-app -p 83:80 pikky-app