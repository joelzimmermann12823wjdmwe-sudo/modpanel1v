# Dockerfile
# 1. Wähle ein offizielles PHP-Image mit Apache Webserver als Basis
FROM php:8.2-apache

# 2. Kopiere alle lokalen Dateien (inkl. dashboard/) in das Web-Verzeichnis von Apache im Container
# Der Punkt '.' repräsentiert das gesamte Wurzelverzeichnis, wo die Dockerfile liegt.
COPY . /var/www/html/

# 3. Führe interne Konfigurationsbefehle aus (RUN-Befehle)
# Wir überschreiben die Apache-Konfiguration, damit der Server den Ordner 'dashboard' als Wurzel ('DocumentRoot') verwendet.
RUN echo "DocumentRoot /var/www/html/dashboard" > /etc/apache2/sites-enabled/000-default.conf
# Wir stellen sicher, dass index.php und index.html als Standardseiten erkannt werden.
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/sites-enabled/000-default.conf

# Der Container startet automatisch den Apache-Server basierend auf dem 'php:8.2-apache' Image.