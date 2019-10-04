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

reprendre a partir de correler table arp