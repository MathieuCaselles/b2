#TP  HTTP

# Soleil

Pour la configuration du servername, je donne els droit à www-data pour le chemin /var/www/html/ pour accéder a dokuwiki et a /etc/apache2/ pour y déplacer mon fichier config wiki.lab.local.conf servant a paramétrer le ServerName.  
  
J'utilise `    sudo a2ensite wiki.lab.local` pour activer le virtualhost puis redémarre apache2.  

## Poulpe!!

Je commence par installer nginx `sudo apt-get install nginx -y`.  
  
Je désactive ensuite le virtual host par défaut avec `sudo unlink /etc/nginx/sites-enabled/default` pour ensuite mettre à la place mon fichier `reverse-proxy` permettant de se connecter à la vm master.
Je n'ai plus qu'a redémarrer nginx. 
  
Arriver ici je me retrouve avec une connexion refusé dont je n'ai pas réussis à corriger le problème.  
