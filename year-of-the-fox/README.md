### Year of the Fox Room

[link](https://tryhackme.com/room/yotf)

```bash
$ export ip=10.10.71.216
```


ok, this machine is classified as hard let us start with nmap and some enumerations.

```bash
$ sudo nmap -sS -p- $ip -T3 -vv > nmap/inital
```
1. -sS: do all simple enumerations
2. -p-: all ports

i'm using a new text editor now, not sublime anymore...The name of the new is obsidian, is so beatiful dude omg. Don't worry about it just a aleatory notes while the nmap scan isn't done.

maybe this ip has a http server open so while the nmap isn't done i'll try to find web pages opened.

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
it's possible connect but it have nothing inside, i'm not able to put anything into and the share "yotf" needs credentials....

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

and don't have nothing....but i'll use this to brute forcing the http-post

after so many time, i decided to scan one more and try brute force more users because fox user didn't give anything to me.

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
$ hydra -l rascal -P /usr/share/wordlists/wordlists/rockyou.txt 10.10.71.216 http-head /
```
question 1: why http-head in hydra command?

i was questioning myself about this, but maybe it's because the login that this site requests it's the standart, anyway the brute force works with http-post too. But in another login pages like isn't the standart login form from browser you'll need to use http-post and specify the layers and a response which the site sends to you, i think so. 

THANKS GOD. 

![](attachments/Pasted%20image%2020231016082740.png)

logging with rascal:

![](attachments/Pasted%20image%2020231016082813.png)

let's take a look at this web page...

doesn't have anything in storage but i found two js files,probaly interlinked with this input "Looking for something?". But first let me see what this input do...He searchs for files, i can't type some chars like " * /  % , . ; . " he immediately exclues what i type. But i can type fast the char "/" and get a return:

![](attachments/Pasted%20image%2020231016083401.png)

but i can't read, maybe can i bypass this "security layer" and inject commands?


