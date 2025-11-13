# Dockerfile
FROM php:8.2-apache

# Kopiere ALLE Dateien
COPY . /var/www/html/

# *KORREKTUR* #
# Setze die Dokumenten-Wurzel auf den Ordner 'public'
RUN echo "DocumentRoot /var/www/html/dashboard/public" > /etc/apache2/sites-enabled/000-default.conf

# Stelle sicher, dass index.html gefunden wird.
# Wichtig: api.php wird nicht mehr als DirectoryIndex benötigt,
# da sie über das Frontend aufgerufen wird (z.B. /src/api.php).
RUN echo "DirectoryIndex index.html index.php" >> /etc/apache2/sites-enabled/000-default.conf