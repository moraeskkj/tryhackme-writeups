### Internal by Tryhackme

first i'll leave the link to room [there](https://tryhackme.com/room/internal) and you can read the scope of "work" about this room if you want.  But basically this room needs to be  seen as real pentest, so...let's start this machine and report all vulnerabilities that i find and how to fix them.

there is a few scope allowances that the "client" provided:

	1. Ensure that you modify your hosts file to reflect "internal.thm". 
	2. Any tools or techniques are permitted in this engagement.
	3. Locate and note all vulnerabilities found.
	4. Submit the flags discovered to the dashboard.
	5. Only the IP address assigned to your machine is in scope.

first, i'm gonna get the ip address from machine and modify my hosts file.

```bash
$ nano /etc/hosts
```

your hosts file will look like this:
![](attachments/Pasted%20image%2020231022110931.png)

and now let's start with nmap scan, i'll create a folder to nmap.

```bash
$ sudo nmap -sS -p- internal.thm -vv > nmap/initial.txt
```
explaining again,i do more enumerations after this first scan using -A flags and specifyng the ports that were found in the first scan.

while it is not done i'll see if there is a http server running...
![](attachments/Pasted%20image%2020231022112918.png)
and had. So, it is the default page of apache but it's nothing there despite of that it can be misconfigured....i'll use gobuster to see if there is any directories exposed or anything like this.

```bash 
$ gobuster -w /usr/share/wordlists/dirbuster/directory-medium-2.3.txt -u internal.thm -x txt,js,php,md
```

![](attachments/Pasted%20image%2020231022115519.png)
ok,good but let me take a look at nmap scan first. And nmap scan found two ports, 80 running http server and 22 running ssh.

so now i have these informations:

	1. the OS of the machine is LINUX and the distro is UBUNTU.
	2. there is a http server and ssh running and open.
	3. there is some directories available to anyone.
	4. apache version is 2.4.29
	5. wordpress version is

note: I will expand this list depending on what I find.

let's look at these directories and see if i get more information.

so,i'm taking note about all of these pages and trying to find an vuln, so when i found something i'll write here

ok i found this:
![](attachments/Pasted%20image%2020231022133902.png)
so,as can you see, this login page of word press is so much verbose. I bet on "admin" user just to clear my mind and he exists and i know it because of this error message, it's  very verbose you know?

if i put another aleatory user:  
![](attachments/Pasted%20image%2020231022140831.png)
so,while i'm checking another pages and trying to find another vulns i'll put hydra to brute force this.

first i'll look the request with burp to see the response and how this post form is sended to server.
![](attachments/Pasted%20image%2020231022141526.png)

```bash
$ hydra -l admin -P /usr/share/wordlists/rockyou.txt internal.thm http-post-form "/blog/wp-login.php:log=^USER^+&pwd=^PASS^&wp-submit=Log+In&redirect_to=http%3A%2F%2Finternal.thm%2Fblog%2Fwp-admin%2F&testcookie=1:incorrect." -V -F
```

ok so, while hydra is trying there i'll search for more things..
![](attachments/Pasted%20image%2020231022142935.png)

i found another login page, and these erros are weird.

![](attachments/Pasted%20image%2020231022143303.png)
let's gooo. ok now i have credentials and i'm gonna login in the web site.

so, as can you see i have access to wordpress panel and these panel have a lot of ways to make an rce.
![](attachments/Pasted%20image%2020231022143424.png)

and the first thing that i would try here is try to change the php code from a some page to an reverse shell in php and if it doesn't work i'll try using the plugins to get a reverse shell.

there is two ways to do this reverse shell:

	1. Go to Apperance and click in the "Theme Editor" or "Editor" Button, this session of the page allows you edit all php code of some pages, you just need to change the code of one of these pages for an reverse shell code.
	2. Go to Plugins and add an new plugin( maybe you'll need to use a plugin generator or something like this idk)

i'm gonna use the first method beacause is more easier.

![](attachments/Pasted%20image%2020231022144848.png)
i'm gonna modify the "404 Template" to a reverse shell from pentest monkey.

![](attachments/Pasted%20image%2020231022145645.png)

now is just access this file to get the shell, usually these files remain in:

	http://internal.thm/wp-content/themes/pluginname/404.php

but when i was trying to bruteforcing directories with gobuster i didn't find "wp-content" directory, but i found he in:

	http://internal.thm/wp-content/themes/twentyseventeen/404.php

	note: please look at the name of the theme that you edited

so now i'm inside the machine :)
![](attachments/Pasted%20image%2020231022150105.png)
spawn better shell and etc:
![](attachments/Pasted%20image%2020231022150229.png)

i found this user called by "aubreanna" but i can't access your directory.
![](attachments/Pasted%20image%2020231022150311.png)

a lot of files in /var/www/html/
![](attachments/Pasted%20image%2020231022150519.png)
i don't forget that this machine has a ssh open and mysql running into, so maybe can i leak some credentials?

i'll use grep to see if there is some credentials or something like this

```bash
$ grep --color=always -r -i "pass" 
```

and i didn't find nothing.

i'm found a binary in the snap folder called by "pppd" with suid permission that i want to analyze he with a ghidra, so while i'm doing this i'm gonna run linpeas in my reverse shell and see what happes ;)

a lot of intersting things that linpeas found
![](attachments/Pasted%20image%2020231022153108.png)


$dbpass='B2Ud4fEOZmVq';
$dbuser='phpmyadmin';
define('DB_PASSWORD', 'wordpress123');
define('DB_USER', 'wordpress');


![](attachments/Pasted%20image%2020231022153205.png)

![](attachments/Pasted%20image%2020231022153338.png)

![](attachments/Pasted%20image%2020231022153244.png)

/usr/bin/at  --->  RTru64_UNIX_4.0g(CVE-2002-1614)

/snap/core/8268/usr/lib/snapd/snap-confine  --->  
Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)

/etc/alternatives/my.cnf -> /etc/mysql/mysql.cnf

lrwxrwxrwx 1 root root 24 Aug  3  2020 /etc/mysql/my.cnf -> /etc/alternatives/my.cnf
-rw-r--r-- 1 root root 81 Aug  3  2020 /var/lib/dpkg/alternatives/my.cnf

runc was found in /usr/sbin/runc, you may be able to escalate privileges with it
ctr was found in /usr/bin/ctr, you may be able to escalate privileges with it

╔══════════╣ Analyzing Wordpress Files (limit 70)
-rw-r--r-- 1 root root 3109 Aug  3  2020 /var/www/html/wordpress/wp-config.php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'wordpress' );
define( 'DB_PASSWORD', 'wordpress123' );
define( 'DB_HOST', 'localhost' );

i'll organize and finish this room tomorrow but while the time of the room doesn't finish i'll try bruteforcing the user aubreanna in ssh :)