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


### Task5


### Task6


### Task7


### Task8



