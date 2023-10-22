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


