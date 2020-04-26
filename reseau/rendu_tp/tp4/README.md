# Rendu TP 4

## I. Sujet global : refresh

Pas besoin de t'embêter avec un screen du schéma c'est le mêm que le tiens à par pour les ports du routeur c'est `f0/0` pour le port vers le nat, `f1/0` pour le port vers client-sw2 et enfin `f2/0` vers infra-sw1.  
  
Conf du routeur: 

    r1#show ip int br
    Interface                  IP-Address      OK? Method Status                Protocol
    FastEthernet0/0            192.168.122.89  YES DHCP   up                    up
    FastEthernet1/0            unassigned      YES NVRAM  up                    up
    FastEthernet1/0.10         10.5.10.254     YES NVRAM  up                    up
    FastEthernet1/0.20         10.5.20.254     YES NVRAM  up                    up
    FastEthernet1/0.30         unassigned      YES unset  up                    up
    FastEthernet2/0            unassigned      YES NVRAM  up                    up
    FastEthernet2/0.30         10.5.30.254     YES NVRAM  up                    up

conf d'un switch:

    
    10   admins                           active    Et1/1
    20   guests                           active    Et1/2

    Port        Mode             Encapsulation  Status        Native vlan
    Et0/0       on               802.1q         trunking      1
    Et0/1       on               802.1q         trunking      1
    Et0/2       on               802.1q         trunking      1

    Port        Vlans allowed on trunk
    Et0/0       1-4094
    Et0/1       1-4094
    Et0/2       1-4094

    Port        Vlans allowed and active in management domain
    Et0/0       1,10,20,30
    Et0/1       1,10,20,30
    Et0/2       1,10,20,30


Preuve que c'est fonctionnel:  
  
Ping depuis un vpcs:

    admin3> ping 8.8.8.8
    84 bytes from 8.8.8.8 icmp_seq=1 ttl=52 time=332.147 ms

Ping depuis une vm (la vm dns-1):

    [root@localhost ~]# ping 8.8.8.8
    PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
    64 bytes from 8.8.8.8: icmp_seq=1 ttl=52 time=145 ms

## II. Anonymat en ligne


### Proxy Http

Après avoir un peu galérer a trouver un proxy fonctionnel, j'utilise le proxy possédant l'adresse 159.8.114.34 et le port 8123 (http) puis avec 188.165.16.230 au port 3129 (https).  
  
Je n'arrive pas a voir la différence a part que dans les deux cas je constate avec wireshark beauuuuucoup de requêtes tcp à destionation de leur adresse.  

### Tor

Il y a beaucoup de trafique utilisant le protocol TCP en faisant une recherche avec tor avec comme destination l'ip 192.168.0.27 rt 176.9.148.20 tel que : 

    629	12.907508	192.168.0.27	176.9.148.20	TCP	54	15999 → 9993 [ACK] Seq=22459 Ack=439287 Win=64240 Len=0
Et aussi des trafique avec le protocol TLSv1.2 avec les même ip en destination.

Avec un navigateur classique je remarque plein de traffique avec en protocol TLSv1.2 mais avec en destination cette fois une adresse mac.. Et aussi toujours des protocol tcp vers des ip.

### Hidden service tor

J'ai l'impression que le trafique HTTP n'est pas dirigé vers l'IP de notre VM directement.
Les résultats m'ont l'air très similaire à ceux d'une recherche à une recherche classique avec tor.

### DoH/DoT

Avec le dns classique on peut voir quel site web on visite grâce à son ip alors qu'avec le DoH ce n'est pas le cas. Cela permet de cacher en quelque sorte le site web que l'on visite.
