FROM php:8.2-apache

COPY . /var/www/html/

RUN echo "DocumentRoot /var/www/html/dashboard" > /etc/apache2/sites-enabled/000-default.conf
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/sites-enabled/000-default.conf
