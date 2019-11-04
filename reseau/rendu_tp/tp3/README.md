# Rendu TP 3

## I. Router-on-a-stick

Les ping fonctionnent très bien comme on peut le voir ci-dessous. Les seuls ping qui ne passent pas sont les pings destiné au routeur car il n'a que les adresses passerelles et les ping vers pc1 ou depuis pc1 car il est isolé des autres VLANs.  

    PC-1> ping 10.3.20.2
    host (10.3.10.254) not reachable

    PC-3> ping 10.3.10.1
    10.3.10.1 icmp_seq=1 timeout
    10.3.10.1 icmp_seq=2 timeout
    10.3.10.1 icmp_seq=3 timeout

    PC-4> ping 10.3.20.3
    84 bytes from 10.3.20.3 icmp_seq=1 ttl=63 time=19.532 ms
    84 bytes from 10.3.20.3 icmp_seq=2 ttl=63 time=13.427 ms
    84 bytes from 10.3.20.3 icmp_seq=3 ttl=63 time=17.945 ms

    PC-2> ping 10.3.40.1
    84 bytes from 10.3.40.1 icmp_seq=1 ttl=63 time=20.889 ms
    84 bytes from 10.3.40.1 icmp_seq=2 ttl=63 time=18.928 ms
    84 bytes from 10.3.40.1 icmp_seq=3 ttl=63 time=18.528 ms

    P1> ping 10.3.30.254
    84 bytes from 10.3.30.254 icmp_seq=1 ttl=255 time=4.082 ms
    84 bytes from 10.3.30.254 icmp_seq=2 ttl=255 time=7.185 ms
    84 bytes from 10.3.30.254 icmp_seq=3 ttl=255 time=7.509 ms


## II. Cas concret


Machines | `10.3.10.0/24` | `10.3.20.0/24` | `10.3.30.0/24` | `10.3.40.0/24` | `10.3.50.0/24` | `10.3.60.0/24`
--- | --- | --- | --- | --- | --- | ---
`Admin1` | `10.3.10.1` | - | - | - | - | -
`Admin2` | `10.3.10.2` | - | - | - | - | -
`Admin3` | `10.3.10.3` | - | - | - | - | -
`User1` | - | `10.3.20.1` | - | - | - | -
`User2` | - | `10.3.20.2` | - | - | - | -
`User3` | - | `10.3.20.3` | - | - | - | -
`UserN` | - | `10.3.20.N` | - | - | - | -
`User16` | - | `10.3.20.16` | - | - | - | -
`Stagiere1` | - | - | `10.3.30.1` | - | - | -
`StagiereN` | - | - | `10.3.30.N` | - | - | -
`Stagiere8` | - | - | `10.3.30.8` | - | - | -
`Serveur 1` | - | - | - | `10.3.40.1` | - | -
`Serveur N` | - | - | - | `10.3.40.2` | - | -
`Serveur 4` | - | - | - | `10.3.40.4` | - | -
`SS1` | - | - | - | - | `10.3.50.1` | -
`SS2` | - | - | - | - | `10.3.50.2` | -
`Imprimante1` | - | - | - | - | - | `10.3.60.1`
`ImprimanteN` | - | - | - | - | - | `10.3.60.N`
`Imprimante5` | - | - | - | - | - | `10.3.60.5`
`R1` | `10.3.10.254` | `10.3.20.254` | `10.3.30.254` | `10.3.40.254` | `10.3.50.254` | `10.3.60.254`

Actuellement tout le monde peux se ping grace au router peut importe le vlan des machines. Je les séparerais dans la partie "qui a accès à qui exactement ?" .  
Tout le monde a aussi accès a internet.
 
### partie hard

Je propose de mettre 5 routeurs. (1 par salle).

Nombre de cable nécessaire : 

* cours: x20
* moyen: x20
* long: x4 

* Soit 44 câbles au total.


![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp3/screen.png)


Réseau | Adresse | Vlan | Description
--- | --- | --- | ---
`Admin` | `10.3.10.0/24` | 10 | Administrateurs
`User` |`10.3.20.0/24` | 20 | Utilisateurs
`Stagiere` | `10.3.30.0/24` | 30 | Stagières
`Serveur` | `10.3.40.0/24` | 40 | Serveurs
`SS` | `10.3.50.0/24` | 50 | Serveurs Sensibles
`Imprimante` | `10.3.60.0/24` | 60 | Imprimantes

  

Machines | VLAN | `10.3.10.0/24` | `10.3.20.0/24` | `10.3.30.0/24` | `10.3.40.0/24` | `10.3.50.0/24` | `10.3.60.0/24`
--- | --- | --- | --- | --- | --- | --- | ---
`Admin1` | 10 | `10.3.10.1` | - | - | - | - | -
`Admin2` | 10 | `10.3.10.2` | - | - | - | - | -
`Admin3` | 10 | `10.3.10.3` | - | - | - | - | -
`User1` | 20 | - | `10.3.20.1` | - | - | - | -
`User2` | 20 | - | `10.3.20.2` | - | - | - | -
`User3` | 20 | - | `10.3.20.3` | - | - | - | -
`UserN` | 20 | - | `10.3.20.N` | - | - | - | -
`User16` | 20 | - | `10.3.20.16` | - | - | - | -
`Stagiere1` | 30 | - | - | `10.3.30.1` | - | - | -
`StagiereN` | 30 | - | - | `10.3.30.N` | - | - | -
`Stagiere8` | 30 | - | - | `10.3.30.8` | - | - | -
`Serveur 1` | 40 | - | - | - | `10.3.40.1` | - | -
`Serveur N` | 40 | - | - | - | `10.3.40.2` | - | -
`Serveur 4` | 40 | - | - | - | `10.3.40.4` | - | -
`SS1` | 50 | - | - | - | - | `10.3.50.1` | -
`SS2` | 50 | - | - | - | - | `10.3.50.2` | -
`Imprimante1` | 60 | - | - | - | - | - | `10.3.60.1`
`ImprimanteN` | 60 | - | - | - | - | - | `10.3.60.N`
`Imprimante5` | 60 | - | - | - | - | - | `10.3.60.5`
`R1` | x | `10.3.10.254` | `10.3.20.254` | `10.3.30.254` | `10.3.40.254` | `10.3.50.254` | `10.3.60.254`

L'infra fonctionne:  

    A3> ping 8.8.8.8
    84 bytes from 8.8.8.8 icmp_seq=1 ttl=51 time=73.132 ms
    84 bytes from 8.8.8.8 icmp_seq=2 ttl=51 time=44.264 ms
    ^C

    P4> ping 8.8.8.8
    84 bytes from 8.8.8.8 icmp_seq=1 ttl=51 time=49.886 ms
    84 bytes from 8.8.8.8 icmp_seq=2 ttl=51 time=46.998 ms
    ^C

    S6> ping 8.8.8.8
    84 bytes from 8.8.8.8 icmp_seq=1 ttl=51 time=50.208 ms
    84 bytes from 8.8.8.8 icmp_seq=2 ttl=51 time=85.673 ms
    ^C

    A3> ping 10.3.10.1
    84 bytes from 10.3.10.1 icmp_seq=1 ttl=64 time=0.489 ms
    84 bytes from 10.3.10.1 icmp_seq=2 ttl=64 time=0.944 ms


### Qui a accès à qui exactement ?

Il faut créer des ACL sur le router car actuellement tout le monde peut se ping à causes des sous interfaces du routeur. Je met des des ACL pour interdire certaines ip d'aller ping d'autres ip non voulu.  
  

Pour ce faire je commence par le classique `conf t`.

Je créé ensuite une liste ACL étendue pour le réseau admin d'abord avec `access-list 100 deny ip 10.3.10.0 0.0.0.255 10.3.20.0 0.0.0.255`.  
Cette premiere commande veut dire que je créer un access-list lié au numéro 100 qui va interdire les ip du réseau `10.3.10.0/24` (du réseau admin) de communiquer avec le réseau `10.3.20.0/24` (le réseau user).  
Je répète ensuite cette ligne de commande autant de fois que je veux que le réseau admin ne doit pas communiquer avec d'autres réseaux précis. 
  
Je termine ensuite avec `access-list 100 permit ip any any` sinon j'aurais un problème de timeout avec toutes les ip.  
  
Vu que le réseau admin se situe sur la sous interface e0/0.10, je lie donc cette access-list avec ce sous réseau:

    R1(config)#int e0/0.10
    R1(config-subif)#ip access-group 100 in
  
Le in précise que tout le trafic entrant par cette interface sera contrôlé.  

Et je refais pareil avec toute les interface en changeant le numéro de l'access-list par 101, 102 etc et en continuant a l'assigner à l'interface concernée.  

J'obtient à la fin tout cela:

    R1#show access-list
    Extended IP access list 100
        10 deny ip 10.3.10.0 0.0.0.255 10.3.20.0 0.0.0.255 (9 matches)
        20 deny ip 10.3.10.0 0.0.0.255 10.3.30.0 0.0.0.255 (6 matches)
        30 permit ip any any (19 matches)
    Extended IP access list 101
        10 deny ip 10.3.20.0 0.0.0.255 10.3.10.0 0.0.0.255 (9 matches)
        20 deny ip 10.3.20.0 0.0.0.255 10.3.30.0 0.0.0.255 (6 matches)
        30 deny ip 10.3.20.0 0.0.0.255 10.3.50.0 0.0.0.255 (6 matches)
        40 permit ip any any (4 matches)
    Extended IP access list 102
        10 deny ip 10.3.30.0 0.0.0.255 10.3.10.0 0.0.0.255 (6 matches)
        20 deny ip 10.3.30.0 0.0.0.255 10.3.20.0 0.0.0.255
        30 deny ip 10.3.30.0 0.0.0.255 10.3.40.0 0.0.0.255
        40 deny ip 10.3.30.0 0.0.0.255 10.3.50.0 0.0.0.255
        50 permit ip any any
    Extended IP access list 103
        10 deny ip 10.3.40.0 0.0.0.255 10.3.30.0 0.0.0.255
        20 deny ip 10.3.40.0 0.0.0.255 10.3.50.0 0.0.0.255
        30 permit ip any any (4 matches)
    Extended IP access list 104
        10 deny ip 10.3.50.0 0.0.0.255 10.3.20.0 0.0.0.255 (6 matches)
        20 deny ip 10.3.50.0 0.0.0.255 10.3.30.0 0.0.0.255
        30 deny ip 10.3.50.0 0.0.0.255 10.3.40.0 0.0.0.255 (6 matches)
        40 deny ip 10.3.50.0 0.0.0.255 10.3.60.0 0.0.0.255
        50 permit ip any any
    Extended IP access list 105
        10 deny ip 10.3.60.0 0.0.0.255 10.3.50.0 0.0.0.255 (6 matches)
        20 permit ip any any

  
C'est bon ! le `"qui a accès à qui exactement ?"` est fonctionnel !

Voici quelques test: 

    A3> ping 10.3.20.7
    *10.3.10.254 icmp_seq=1 ttl=255 time=32.167 ms (ICMP type:3, code:13, Communication administratively prohibited)
    *10.3.10.254 icmp_seq=2 ttl=255 time=13.190 ms (ICMP type:3, code:13, Communication administratively prohibited)
    *10.3.10.254 icmp_seq=3 ttl=255 time=7.101 ms (ICMP type:3, code:13, Communication administratively prohibited)

L'admin3 n'a pas le droit de joindre le user7 !

    A3> ping 10.3.50.2
    10.3.50.2 icmp_seq=1 timeout
    10.3.50.2 icmp_seq=2 timeout
    84 bytes from 10.3.50.2 icmp_seq=3 ttl=63 time=13.085 ms
    84 bytes from 10.3.50.2 icmp_seq=4 ttl=63 time=22.440 ms
    84 bytes from 10.3.50.2 icmp_seq=5 ttl=63 time=20.626 ms
  
Par contre le serveur sensible oui ! Les timeout du début sont la à cause du fait que les ACL rajoutent du lag au serveur.

    P1> ping 10.3.10.3
    10.3.10.3 icmp_seq=1 timeout
    10.3.10.3 icmp_seq=2 timeout
    84 bytes from 10.3.10.3 icmp_seq=3 ttl=63 time=19.150 ms
    84 bytes from 10.3.10.3 icmp_seq=4 ttl=63 time=20.701 ms
    84 bytes from 10.3.10.3 icmp_seq=5 ttl=63 time=13.759 ms

L'imprimante p1 arrive bien a ping admin3! Et tout le monde d'ailleur ! Sauf les serveurs sensible (ss):

    P1> ping 10.3.50.1
    *10.3.60.254 icmp_seq=1 ttl=255 time=14.725 ms (ICMP type:3, code:13, Communication administratively prohibited)
    *10.3.60.254 icmp_seq=2 ttl=255 time=3.491 ms (ICMP type:3, code:13, Communication administratively prohibited)

Et voila ! 🌞



