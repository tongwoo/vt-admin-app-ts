FROM nginx:1.21-alpine

MAINTAINER tongwoo

EXPOSE 80

ENV API=http://host.docker.internal

WORKDIR /app

COPY --chown=nginx:nginx ./app .
COPY --chown=nginx:nginx ./docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx ./docker/conf/app.conf /etc/nginx/templates/default.conf.template
