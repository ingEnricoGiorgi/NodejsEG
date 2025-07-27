FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY  ./HTML .

COPY  ./nginx.conf .

EXPOSE 80

CMD ["nginx","-g","daemon off;"]