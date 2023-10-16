### Year of the Fox Room

[link](https://tryhackme.com/room/yotf)

```bash
$ export ip=10.10.71.216
```


ok, this machine is classified as hard let us start with nmap and some enumerations.

```bash
$ sudo nmap -sS -p- $ip -T3 -vv > nmap/inital
```

i'm using a new text editor now, not sublime anymore...The name of the new is obsidian, is so beatiful dude omg. Don't worry about it just a aleatory notes while the nmap scan isn't done.

maybe this ip has a http server open so while the nmap isn't done i'll try to find web pages opened.

![](attachments/Pasted%20image%2020231016051220.png)

uoh, ok...Isn't possible to connect without username and passwords but the page show to us that the web server is Apache and the version is 2.4.29.

no cookies, nothing in view source too...

just doing a search in msfconsole i found this three exploits, can be a try if i'm lost.

```
1   exploit/multi/http/apache_normalize_path_rce              2021-05-10       excellent  Yes    Apache 2.4.49/2.4.50 Traversal RCE
2   auxiliary/scanner/http/apache_normalize_path              2021-05-10       normal     No     Apache 2.4.49/2.4.50 Traversal RCE scanner
3   exploit/windows/http/apache_activemq_traversal_upload     2015-08-19       excellent  Yes    Apache ActiveMQ 5.x-5.11.1 Directory Traversal Shell Upload
```

nmap scan is finally done,let's take a look...

```bash
PORT    STATE SERVICE      REASON
80/tcp  open  http         syn-ack ttl 63
139/tcp open  netbios-ssn  syn-ack ttl 63
445/tcp open  microsoft-ds syn-ack ttl 63
```

it's all what he got...

1. the http server with login
2. smb with netbios
3. smb connection

so,let's try enum4linux to enumarate this smb server

```bash
$ locate enum4linux
$ python3 /home/akame/tools/enum4linux-ng/enum4linux-ng.py $ip -vv
```

```bash
 ===========================================================
|    Domain Information via SMB session for 10.10.71.216    |
 ===========================================================
[*] Enumerating via unauthenticated SMB session on 445/tcp
[+] Found domain information via SMB
NetBIOS computer name: YEAR-OF-THE-FOX
NetBIOS domain name: ''
DNS domain: lan
FQDN: year-of-the-fox.lan
Derived membership: workgroup member
Derived domain: unknown
=====================================
|    Users via RPC on 10.10.71.216    |
 =====================================
[*] Enumerating users via 'querydispinfo'
[V] Attempting to get userlist, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpejcle01b -c querydispinfo 10.10.71.216
[+] Found 1 user(s) via 'querydispinfo'
[*] Enumerating users via 'enumdomusers'
[V] Attempting to get userlist, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpejcle01b -c enumdomusers 10.10.71.216
[+] Found 1 user(s) via 'enumdomusers'
[+] After merging user results we have 1 user(s) total:
'1000':
  username: fox
  name: fox
  acb: '0x00000010'
  description: ''
======================================
|    Shares via RPC on 10.10.71.216    |
 ======================================
[V] Attempting to get share list using authentication, running command: smbclient -W YEAROFTHEFOX -U % -s /tmp/tmpejcle01b -t 5 -L //10.10.71.216 -g
[*] Enumerating shares
[+] Found 2 share(s):
IPC$:
  comment: IPC Service (year-of-the-fox server (Samba, Ubuntu))
  type: IPC
yotf:
  comment: Fox's Stuff -- keep out!
  type: Disk  
```

interesting things here.....username "fox" and share "yotf"

```bash 
$ smbclient ////10.10.71.216//ipc$ -N 
```

it's possible connect but it have nothing inside, i'm not able to put anything into and the share "yotf" needs credentials....

i'm gonna try gobuster but if i got nothing maybe brute forcing is a good ideia...

```bash
$ gobuster -u http://10.10.71.216/ -w /usr/share/wordlists/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,js,php,md
```