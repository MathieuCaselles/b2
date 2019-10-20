# TD-dns

* Connectez vous au host "proxy" avec vagrant et vérifier Comment est configuré le resolver dns du système ?

Le résolver dns du système est configuré dans `/etc/resolv.conf` sous la forme:

    nameserver 192.168.33.21                                                                      nameserver 192.168.33.22  


*Retrouvez l'adresse ip du host wiki.lab.local avec la commande dig.

Je fais `dig -x ip-adress wiki.lab.local` et retrouve bien l'adresse ip du host sur cette ligne:

    wiki.lab.local.         3491    IN      A       192.168.56.11

* Connectez vous au host auth-1, quels sont les services réseaux qui sont en fonctionnement actuellement quels sont leur socket d'écoute ?

    [vagrant@auth-1 ~]$ sudo ss -ltupn | grep LISTEN                                                                                                            tcp    
    LISTEN     0      50     127.0.0.1:3306                  *:*                   users:(("mysqld",pid=6325,fd=14))                                     tcp    
    LISTEN     0      128       *:111                   *:*                   users:(("rpcbind",pid=1358,fd=4),("systemd",pid=1,fd=58))                  tcp    
    LISTEN     0      128    192.168.33.31:80                    *:*                   users:(("httpd",pid=6382,fd=3),("httpd",pid=6381,fd=3),("httpd",pid=6380,fd=3),("httpd",pid=6379,fd=3),("httpd",pid=6378,fd=3),("httpd",pid=6376,fd=3))                                                                       tcp    
    LISTEN     0      128       *:53                    *:*                   users:(("pdns_server",pid=6397,fd=7))                                      tcp      
    LISTEN     0      100    127.0.0.1:25                    *:*                   users:(("master",pid=2675,fd=13))                                     tcp    
    LISTEN     0      128      :::111                  :::*                   users:(("rpcbind",pid=1358,fd=6),("systemd",pid=1,fd=60))                  tcp    
    LISTEN     0      128      :::53                   :::*                   users:(("pdns_server",pid=6397,fd=8))                                      tcp      
    LISTEN     0      100     ::1:25                   :::*                   users:(("master",pid=2675,fd=14))
    
* Connectez vous au host recursor-1,  quels sont les services réseaux qui sont en fonctionnement actuellement quels sont leur socket d'écoute ?

    [vagrant@recursor-1 ~]$ sudo ss -ltupn | grep LISTEN                                                                                                        tcp    
    LISTEN     0      128       *:111                   *:*                   users:(("rpcbind",pid=1637,fd=4),("systemd",pid=1,fd=69))                  tcp    
    LISTEN     0      128    192.168.33.21:53                    *:*                   users:(("pdns_recursor",pid=5959,fd=7))                           tcp    
    LISTEN     0      128    127.0.0.1:53                    *:*                   users:(("pdns_recursor",pid=5959,fd=6))                               tcp   
    LISTEN     0      100    127.0.0.1:25                    *:*                   users:(("master",pid=2633,fd=13))                                     tcp    
    LISTEN     0      128      :::111                  :::*                   users:(("rpcbind",pid=1637,fd=6),("systemd",pid=1,fd=71))                  tcp    
    LISTEN     0      100     ::1:25                   :::*                   users:(("master",pid=2633,fd=14))                                                                                                                                     
* Où sont configuré chacuns de ces composants ?

`sudo find / .conf | grep .orig`

    /etc/NetworkManager/NetworkManager.conf.orig                                                         /etc/pdns-recursor/recursor.conf.orig 

La ou se trouve les fichiers .conf.orig se trouve a coté les fichier de conf. Chacun de ces composants sont donc dans `/etc/NetworkManager/NetworkManager.conf` et `/etc/pdns-recursor/recursor.conf`.



* Qu'est ce qui est configuré sur les serveurs recursifs pour le domaine lab.local ?

`vi /etc/pdns-recursor/recursor.conf`

Je fais un /lab.local pour trouver l'endroit ou c'est configuré et je trouve cette configuration:

    forward-zones=lab.local=192.168.56.31;192.168.56.32

Cela sert au fait que si le premier server ne répond plus (192.168.56.31) de se connecter au deuxième (192.168.56.32).


* Comment mettre en évidence le fait que le récurseurs ne répondent que sur l’interface du réseaux back ?

`vi /etc/pdns-recursor/recursor.conf`

Je fais un /192.168.33 et je constate que 192.168.33.21 est lié à l'adresse locale et que 192.168.33.0/24 est autorisé.

* Comment est sécurisé l’accès à mysql ?

L'accès à mysql se fait uniquement sur auth-1 et auth-2 et non directement depuis recursor-1 et recursor-2

