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


![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/screen.png)


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

