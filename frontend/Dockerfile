FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY HTML /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]