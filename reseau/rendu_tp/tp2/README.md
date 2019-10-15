# Rendu TP 2

## I. Simplest setup

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/gns3-tp2-screen.png)  

Les pings fonctionnent:

    PC-1> ping 10.2.1.2
    84 bytes from 10.2.1.2 icmp_seq=1 ttl=64 time=0.135 ms
    84 bytes from 10.2.1.2 icmp_seq=2 ttl=64 time=0.254 ms
    84 bytes from 10.2.1.2 icmp_seq=3 ttl=64 time=0.275 ms
    ^C

    PC-2> ping 10.2.1.1
    84 bytes from 10.2.1.1 icmp_seq=1 ttl=64 time=0.147 ms
    84 bytes from 10.2.1.1 icmp_seq=2 ttl=64 time=0.738 ms
    84 bytes from 10.2.1.1 icmp_seq=3 ttl=64 time=0.299 ms
    ^C


Le protocole utilisé par ping est ICMP:

    59	54.700288	10.2.1.1	10.2.1.2	ICMP	98	Echo (ping) request  id=0x822d, seq=2/512, ttl=64 (reply in 60)

Voici l'échange arp mis en évidence par wireshark:

    27	26.802309	Private_66:68:00	Broadcast	ARP	64	Who has 10.2.1.2? Tell 10.2.1.1 [ETHERNET FRAME CHECK SEQUENCE INCORRECT]
    28	26.803082	Private_66:68:01	Private_66:68:00	ARP	64	10.2.1.2 is at 00:50:79:66:68:01 [ETHERNET FRAME CHECK SEQUENCE INCORRECT]

Et la table arp de pc1 en exemple:

    PC-1> show arp

    00:50:79:66:68:01  10.2.1.2 expires in 114 seconds

Le cache ARP permet de sauvegarder ( se souvenir ) pendant un certain de qui est qui

On a donc les 2 pc qui au premier ping demande en broadcast qui est 10.2.1.2 puis après la réponse ARP le ping s'effectue en ICMP

Une switch n'a pas d'ip, elle renvoie simplement les paquets que tu lui donne vers la bonne ip
Les machines ont besoin d'une adresse vers laquelle envoyer des paquets, donc d'une IP.

## II. More switches

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/gns3-tp2-screen2.png)  

Les pings fonctionnent:

    PC-1> ping 10.2.2.2
    84 bytes from 10.2.2.2 icmp_seq=1 ttl=64 time=1.163 ms
    84 bytes from 10.2.2.2 icmp_seq=2 ttl=64 time=0.561 ms
    ^C
    PC-1> ping 10.2.2.3
    84 bytes from 10.2.2.3 icmp_seq=1 ttl=64 time=1.055 ms
    84 bytes from 10.2.2.3 icmp_seq=2 ttl=64 time=0.444 ms
    84 bytes from 10.2.2.3 icmp_seq=3 ttl=64 time=0.625 ms


Les 3 lignes qui apparaissent dans la table MAC du switch 1 sont expliqué par le fait que la table retiens vers quel port renvoyer le traffic pour chaque addresse mac.
Quand il recevra une trame addressé à aabb.cc00.0200, il le transmettra par l'interface Et0/1:  

 1    aabb.cc00.0200    DYNAMIC     Et0/1


### Mise en évidence du Spanning Tree Protocol

Le route bridge est le switch 1. On le constate à la troisième ligne :  

    Root ID    Priority    32769
             Address     aabb.cc00.0100
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

La liaison entre le switch 2 est 3 à été coupé car le port du switch 3 connecté au switch 1 a été désactivé :

    Interface           Role Sts Cost      Prio.Nbr Type
    ------------------- ---- --- --------- -------- --------------------------------
    Et0/0               Altn BLK 100       128.1    Shr


                       +---+---+
                   +---+  SW2  +----+
                   |   +-------+    |
                   |                |
                   |                x port désactivé
               +---+---+        +---+---+        
               +  SW1  +--------+  SW3  +
               | Root  |        +-------+  
               | Bridge|        
               +-------+             



STP a donc désactivé  le lien entre SW2 et SW3. On peut le verifier avec wireshark. Techniquement si je ping pc2 vers pc3 on devrait se dire que la tram icmp va passer par sw2 puis sw3 car il s'agirait du chemin le plus cours. Or on peut constater que le ping n'est pas passé par ce chemin :  

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/liaisonSwitch-2-3.png)   


Mais en regardant les autres liaisons, on voit bien que la trame est passé de SW2 à SW1 puis de SW1 à SW3:  

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/liaisonSwitch-1-2.png)
![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/liaisonSwitch-1-3.png)  
  


Schéma montrant e trajet d'un requette arp:

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/schemaArp.png)  



### Reconfigurer STP

Je change la priorité de mon switch numéro 3 qui n'est pas root bridge avec la commande `conf t` puis `spanning-tree vlan 1 priority 8192` c'est vlan 1 car c'est choisis par défaut et je sais que 8192 est possible car c'est un multiple de 4096.  

Je vérifie les changement :

    IOU3#show spanning-tree

    VLAN0001
    Spanning tree enabled protocol rstp
    Root ID    Priority    8193
                Address     aabb.cc00.0300
                This bridge is the root
                Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Je peux d'ailleur constater que la priorité de switch3 étant désormais la plus basse, il est désormais élu root bridge !  

## Isolation

### 1.Simple

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/isolation1.png)

    10   vlan10_PC1                       active    Et0/0
    20   vlan20_pc2_pc3                   active    Et0/1, Et0/2  



`PC2` ne peut joindre que `PC3`

    PC-2> ping 10.2.3.3
    84 bytes from 10.2.3.3 icmp_seq=1 ttl=64 time=0.157 ms
    84 bytes from 10.2.3.3 icmp_seq=2 ttl=64 time=0.487 ms
    ^C
    PC-2> ping 10.2.3.1

    host (10.2.3.1) not reachable

`PC1` ne peut joindre personne alors qu'il est dans le même réseau:

    PC-1> ping 10.2.3.2
    host (10.2.3.2) not reachable

    PC-1> ping 10.2.3.3
    host (10.2.3.3) not reachable


### 2. Avec trunk


![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/isolation2.png)

    switch1:
    10   net1                             active    Et0/0
    20   net2                             active    Et0/2

    switch2:
    10   net1                             active    Et0/1
    20   net2                             active    Et0/2




    IOU1#show interface trunk

    Port        Mode             Encapsulation  Status        Native vlan
    Et0/1       on               802.1q         trunking      1

    Port        Vlans allowed on trunk
    Et0/1       10,20

    Port        Vlans allowed and active in management domain
    Et0/1       10,20

    Port        Vlans in spanning tree forwarding state and not pruned
    Et0/1       10,20



    IOU2#show interface trunk

    Port        Mode             Encapsulation  Status        Native vlan
    Et0/0       on               802.1q         trunking      1

    Port        Vlans allowed on trunk
    Et0/0       10,20

    Port        Vlans allowed and active in management domain
    Et0/0       10,20

    Port        Vlans in spanning tree forwarding state and not pruned
    Et0/0       10,20



`PC1` ne peut joindre que `PC3`:

    PC-1> ping 10.2.10.2
    84 bytes from 10.2.10.2 icmp_seq=1 ttl=64 time=0.370 ms
    84 bytes from 10.2.10.2 icmp_seq=2 ttl=64 time=0.451 ms
    ^C
    PC-1> ping 10.2.20.1
    No gateway found

    PC-1> ping 10.2.20.2
    No gateway found


`PC4` ne peut joindre que `PC2`:

    PC-4> ping 10.2.20.1
    84 bytes from 10.2.20.1 icmp_seq=1 ttl=64 time=0.247 ms
    84 bytes from 10.2.20.1 icmp_seq=2 ttl=64 time=0.428 ms
    84 bytes from 10.2.20.1 icmp_seq=3 ttl=64 time=0.341 ms
    84 bytes from 10.2.20.1 icmp_seq=4 ttl=64 time=0.465 ms
    84 bytes from 10.2.20.1 icmp_seq=5 ttl=64 time=0.722 ms

    PC-4> ping 10.2.10.1
    No gateway found

    PC-4> ping 10.2.10.2
    No gateway found


Mise en évidence d'utilisation des VLAN's avec Wireshark:

Mon wireshar étant totalement buggué, les captures sont celle d'antoine durand pour la démonstration:

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/ping_switch.png)

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/blind_man.png)

On peut constater dans la première capture qu'il y a une requete arp broadcast qui va passer uniquement dans le vlan 20 (on le voit a la marque bleu) et on voit donc dans la deuxieme capture qui regarde dans une liaison vlan 10 que la requete broadcast n'est pas passé. 

## IV. Need perfs

La topologie n'a pas changé pas besoin de remettre un screen pour juste un cable en plus.

Une fois configuré, on met en evidence avec wireshark les trames lacp: (capturer sur les 2 cables donc):

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp2/lacp.png)



`show ip interface po1` ne me montre pas la bande passante mais me montre:

    Port-channel1 is up, line protocol is up
    Inbound  access list is not set
    Outgoing access list is not set

Je n'ai pas réussis à trouver comment corriger cela.
