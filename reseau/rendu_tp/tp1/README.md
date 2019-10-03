# Rendu TP 1

## I. Gather information

La commande `ip a` permet de récupérer une liste des cartes réseau avec leur nom, leur IP et leur adresse MAC.  
Par exemple voici ci-dessous une partie du résultat que j'ai eu. On y retrouve le nom `enp0s8`, l'ip `192.168.219.8` et l'adresse mac `fe80::b805:9043:e527:9e57`.  

    3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000                                     link/ether 08:00:27:16:68:b3 brd ff:ff:ff:ff:ff:ff                                                                                    inet 192.168.219.8/24 brd 192.168.219.255 scope global dynamic noprefixroute enp0s8                                                      valid_lft 1100sec preferred_lft 1100sec                                                                                            inet6 fe80::b805:9043:e527:9e57/64 scope link noprefixroute                                                                              valid_lft forever preferred_lft forever  


Les cartes réseaux ont bien récupéré une IP en DHCP.  
Pour enp0s3 j'utilise `cat /etc/sysconfig/network-scripts/ifcfg-enp0s3` et je vois dans le résultat `BOOTPROTO="dhcp"` qui me montre bien que l'adresse a été récupéré en dhcp.  
Voici le bail DHCP utilisé:  

    DHCP4.OPTION[1]:                        domain_name = auvence.co                                                                        DHCP4.OPTION[2]:                        domain_name_servers = 10.33.10.20 10.33.10.2 8.8.8.8 8.8.4.4                                    DHCP4.OPTION[3]:                        expiry = 1569593431                                                                             DHCP4.OPTION[4]:                        ip_address = 10.0.2.15                                                                          DHCP4.OPTION[5]:                        requested_broadcast_address = 1                                                                 DHCP4.OPTION[6]:                        requested_dhcp_server_identifier = 1                                                            DHCP4.OPTION[7]:                        requested_domain_name = 1                                                                       DHCP4.OPTION[8]:                        requested_domain_name_servers = 1                                                               DHCP4.OPTION[9]:                        requested_domain_search = 1                                                                     DHCP4.OPTION[10]:                       requested_host_name = 1                                                                         DHCP4.OPTION[11]:                       requested_interface_mtu = 1                                                                     DHCP4.OPTION[12]:                       requested_ms_classless_static_routes = 1                                                        DHCP4.OPTION[13]:                       requested_nis_domain = 1                                                                        DHCP4.OPTION[14]:                       requested_nis_servers = 1                                                                       DHCP4.OPTION[15]:                       requested_ntp_servers = 1                                                                       DHCP4.OPTION[16]:                       requested_rfc3442_classless_static_routes = 1                                                   DHCP4.OPTION[17]:                       requested_routers = 1                                                                           DHCP4.OPTION[18]:                       requested_static_routes = 1                                                                     DHCP4.OPTION[19]:                       requested_subnet_mask = 1                                                                       DHCP4.OPTION[20]:                       requested_time_offset = 1                                                                       DHCP4.OPTION[21]:                       requested_wpad = 1                                                                              DHCP4.OPTION[22]:                       routers = 10.0.2.2                                                                              DHCP4.OPTION[23]:                       subnet_mask = 255.255.255.0                    


Pour enp0s8. Le fichier n'existe pas. Je le créé donc avec `sudo nano /etc/sysconfig/network-scripts/ifcfg-enp0s8` puis je fais `sudo nmcli conn reload` suivi de `sudo nmcli conn up enp0s8` pour dire à centos que j'ai modifié le fichier de config. Je peux maintenant récupérer le bail DHCP:  

    DHCP4.OPTION[1]:                        expiry = 1569512143                                                                             DHCP4.OPTION[2]:                        ip_address = 192.168.219.8                                                                      DHCP4.OPTION[3]:                        requested_broadcast_address = 1                                                                 DHCP4.OPTION[4]:                        requested_dhcp_server_identifier = 1                                                            DHCP4.OPTION[5]:                        requested_domain_name = 1                                                                       DHCP4.OPTION[6]:                        requested_domain_name_servers = 1                                                               DHCP4.OPTION[7]:                        requested_domain_search = 1                                                                     DHCP4.OPTION[8]:                        requested_host_name = 1                                                                         DHCP4.OPTION[9]:                        requested_interface_mtu = 1                                                                     DHCP4.OPTION[10]:                       requested_ms_classless_static_routes = 1                                                        DHCP4.OPTION[11]:                       requested_nis_domain = 1                                                                        DHCP4.OPTION[12]:                       requested_nis_servers = 1                                                                       DHCP4.OPTION[13]:                       requested_ntp_servers = 1                                                                       DHCP4.OPTION[14]:                       requested_rfc3442_classless_static_routes = 1                                                   DHCP4.OPTION[15]:                       requested_routers = 1                                                                           DHCP4.OPTION[16]:                       requested_static_routes = 1                                                                     DHCP4.OPTION[17]:                       requested_subnet_mask = 1                                                                       DHCP4.OPTION[18]:                       requested_time_offset = 1                                                                       DHCP4.OPTION[19]:                       requested_wpad = 1                                                                              DHCP4.OPTION[20]:                       subnet_mask = 255.255.255.0                

Pour afficher la table de routahe je fais `ìp route`:

    [centos8@localhost /]$ ip route                                                                                                         default via 10.0.2.2 dev enp0s3 proto dhcp metric 100                                                                                   10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15 metric 100                                                                 192.168.219.0/24 dev enp0s8 proto kernel scope link src 192.168.219.8 metric 101 

Ces lignes montrent tout simplement les routes à prendre lors de l'utilisation de ces ip.

Pour afficher la table de routage je fais `arp -a`:

    ? (192.168.219.1) at 0a:00:27:00:00:1b [ether] on enp0s8
    _gateway (10.0.2.2) at 52:54:00:12:35:02 [ether] on enp0s3
    ? (192.168.219.2) at 08:00:27:a0:04:e2 [ether] on enp0s8

Ces lignes montrent tout simplement à quelle adresse mac appartient chaque ip.

Je récupère la liste des ports en écoute avec `ss -lput`

    [centos8@localhost ~]$ ss -lput                                                                                         Netid      State        Recv-Q       Send-Q                     Local Address:Port               Peer Address:Port      udp        UNCONN       0            0                   192.168.219.8%enp0s8:bootpc                  0.0.0.0:*         udp        UNCONN       0            0                       10.0.2.15%enp0s3:bootpc                  0.0.0.0:*         udp        UNCONN       0            0                              127.0.0.1:323                     0.0.0.0:*         udp        UNCONN       0            0                                  [::1]:323                        [::]:*         tcp        LISTEN       0            128                              0.0.0.0:ssh                     0.0.0.0:*         tcp        LISTEN       0            128                                 [::]:ssh                        [::]:*        

Je remarque qu'il y a 2 écoute en TCP avec le ssh.  
  
Le firewall est actuellement activé:

    [centos8@localhost ~]$ sudo firewall-cmd --state
    running

## II. Edit configuration

### 1. Configuration cartes réseau

Je défini une ip static pour enp0s8 et enp0s9 en oubliant pas après le `sudo nmcli c reload` et de restart l'interface:

    NAME=enp0s8                                                                                                             DEVICE=enp0s8                                                                                                           BOOTPROTO=static                                                                                                        ONBOOT=yes                                                                                                              IPADDR=192.168.219.8 

Je vérifie ensuite si les changements:

    [centos8@localhost ~]$ ip a
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
        valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host
        valid_lft forever preferred_lft forever
    2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
        link/ether 08:00:27:a5:6c:45 brd ff:ff:ff:ff:ff:ff
        inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic noprefixroute enp0s3
        valid_lft 86004sec preferred_lft 86004sec
        inet6 fe80::4ad6:a897:e477:132f/64 scope link noprefixroute
        valid_lft forever preferred_lft forever
    3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
        link/ether 08:00:27:16:68:b3 brd ff:ff:ff:ff:ff:ff
        inet 192.168.219.8/24 brd 192.168.219.255 scope global noprefixroute enp0s8
        valid_lft forever preferred_lft forever
        inet6 fe80::a00:27ff:fe16:68b3/64 scope link
        valid_lft forever preferred_lft forever
    4: enp0s9: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
        link/ether 08:00:27:86:f2:8b brd ff:ff:ff:ff:ff:ff
        inet 192.168.219.9/24 brd 192.168.219.255 scope global noprefixroute enp0s9
        valid_lft forever preferred_lft forever
        inet6 fe80::a00:27ff:fe86:f28b/64 scope link
        valid_lft forever preferred_lft forever7

    [centos8@localhost ~]$ ip route
    default via 10.0.2.2 dev enp0s3 proto dhcp metric 100
    10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15 metric 100
    192.168.219.0/24 dev enp0s8 proto kernel scope link src 192.168.219.8 metric 103
    192.168.219.0/24 dev enp0s9 proto kernel scope link src 192.168.219.9 metric 104

### 2. Serveur SSH

Je modifie la configuration du système pour que le serveur SSH tourne sur le port 2222 en modifiant le port dans `sudo nano /etc/ssh/sshd_config` et `sudo nano /etc/ssh/sshd_config` puis en faisant `sudo firewall-cmd --permanent --add-port=2222/tcp`.

Je test de me reconnecter en ssh avec `ssh centos8@192.168.219.8 -p 2222` et cela fonctionne bien.

## Routage simple

Machines | `10.0.2.0/24` | `10.0.1.0/24` | `192.168.122.0/24`
--- | --- | --- | ---
`R1` | `10.0.2.254` | `10.0.1.254` | `192.168.122.144` 
`VM1-1` | `10.0.2.10` | - | -
`VM2-1` | - | `10.0.1.11` | -


Voici la configuration des vm (c'est de la vm 1 mais il y a biensur l'équivalent sur l'autre vm): 

    [centos8@vm1 ~]$ ip a                                                                                                                 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000                                               link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00                                                                                 inet 127.0.0.1/8 scope host lo                                                                                                           valid_lft forever preferred_lft forever                                                                                            inet6 ::1/128 scope host                                                                                                                 valid_lft forever preferred_lft forever                                                                                        2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000                                     link/ether 08:00:27:a5:6c:45 brd ff:ff:ff:ff:ff:ff                                                                                    inet 10.0.2.18/24 brd 10.0.2.255 scope global noprefixroute enp0s3                                                                       valid_lft forever preferred_lft forever                                                                                            inet6 fe80::a00:27ff:fea5:6c45/64 scope link                                                                                             valid_lft forever preferred_lft forever                                                                                        3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000                                     link/ether 08:00:27:16:68:b3 brd ff:ff:ff:ff:ff:ff                                                                                    inet 192.168.219.8/24 brd 192.168.219.255 scope global dynamic noprefixroute enp0s8                                                      valid_lft 737sec preferred_lft 737sec                                                                                              inet6 fe80::b805:9043:e527:9e57/64 scope link noprefixroute                                                                              valid_lft forever preferred_lft forever                                                                                        [centos8@vm1 ~]$ ip route                                                                                                             default via 10.0.2.254 dev enp0s3 proto static metric 100                                                                             10.0.1.0/24 via 10.0.1.254 dev enp0s3 proto static metric 100                                                                         10.0.1.254 dev enp0s3 proto static scope link metric 100                                                                              10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.18 metric 100                                                               192.168.219.0/24 dev enp0s8 proto kernel scope link src 192.168.219.8 metric 101                                                      [centos8@vm1 ~]$ cat /etc/sysconfig/network-scripts/ifcfg-enp0s3                                                                      BOOTPROTO=static                                                                                                                      NAME="enp0s3"                                                                                                                         DEVICE="enp0s3"                                                                                                                       ONBOOT="yes"                                                                                                                          IPADDR=10.0.2.18                                                                                                                      GATEWAY=10.0.2.254                                                                                                                    NETMASK=255.255.255.0                                                                                                                 [centos8@vm1 ~]$ cat /etc/hosts                                                                                                       127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4                                                        ::1         localhost localhost.localdomain localhost6 localhost6.localdomain6                                                        10.0.1.12 vm2                                                                                                                         [centos8@vm1 ~]$ cat /etc/hostname                                                                                                    vm1   


Configuration du routeur:  

    R1#show ip int br
    Interface                  IP-Address      OK? Method Status                Protocol
    Ethernet0/0                10.0.2.254      YES manual up                    up
    Ethernet0/1                10.0.1.254      YES manual up                    up
    Ethernet0/2                192.168.122.32  YES DHCP   up                    up
    Ethernet0/3                unassigned      YES unset  administratively down down
    NVI0                       unassigned      NO  unset  up                    up
    R1#show ip route
    Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
        D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
        N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
        E1 - OSPF external type 1, E2 - OSPF external type 2
        i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
        ia - IS-IS inter area, * - candidate default, U - per-user static route
        o - ODR, P - periodic downloaded static route

    Gateway of last resort is 192.168.122.1 to network 0.0.0.0

    C    192.168.122.0/24 is directly connected, Ethernet0/2
        10.0.0.0/24 is subnetted, 2 subnets
    C       10.0.2.0 is directly connected, Ethernet0/0
    C       10.0.1.0 is directly connected, Ethernet0/1
    S*   0.0.0.0/0 [254/0] via 192.168.122.1

Pour la preuve que vm1 passe bien par le routeur pour joindre internet j'utilise traceroute (qu'il aura fallut installé avant):  

    
    [centos8@vm1 ~]$ traceroute 8.8.8.8
    traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
    1  _gateway (10.0.2.254)  4.369 ms  3.814 ms  16.645 ms
    2  192.168.122.1 (192.168.122.1)  16.782 ms  16.677 ms  16.756 ms
    3  10.0.3.2 (10.0.3.2)  16.673 ms  16.585 ms  16.140 ms
    4  * * *
    5  * * *
    6  * * *
    7  * * *
    8  * * *
    9  *^C

![alt text](https://github.com/MathieuCaselles/b2/blob/master/reseau/rendu_tp/tp1/gns3-screen.png)

## IV. Autres applications et métrologie

### 1. Commandes

`iftop` sert à regarder ce qui transite par notre réseau ainsi que la quantité de bande passante qu’utilisent les applications ou services connectés.

### 2. Cockpit

Le port est bien déja ouvert dans le firewall: 

    [centos8@vm1 ~]$ sudo firewall-cmd --add-service=cockpit --permanent
    Warning: ALREADY_ENABLED: cockpit
    success

Pour y accèder je rentre l'adresse enp0s8 sur mon navigateur en spécifiant le port 9090.
Cockpit est en fait une interface graphque de centos c'est super cool on peut quasiment tout modifier via l'interface graphique.

### 3. Netdata

Je met en place Netdata et m'y connecte de la même manière de cockpit mais avec le port 19999 à la place.
J'y découvre énooooooooooormément de graphique à croire que le scrolls est infini.