## Overpass3

$ export ip=10.10.142.160

first i run the nmap and gobuster for to find something:

$ gobuster dir -u $ip -w /usr/share/wordlists/directory_2.3_medium.txt

# sudo nmap -sS -p- $ip -T4 -vv

nmap found three open ports: 21,22,80 and gobuster found /backups directory in web page that contains a zip file, lets go analyze this zip file.

i've unzip the file and got 2 archives. One is a privkey and two is a .gpg file :D

"A GPG file is a file that has been encrypted by GNU Privacy Guard, also known as GnuPG or gpg. It contains a document, image, video, or other file a user encrypted. To decrypt a GPG file, you must have access to the appropriate GnuPG cryptographic key"

$ gpg --decrypt *.gpg

and i got error about priv key so i tried:

$ gpg --import priv.key 

after i tried again and works :D

Opening the xlsx archive with a online excel read, the worksheet has usernames,passwords,names,credit card number and cvc about some persons :D

name / username / pass / credit card / cvv

Par. A. Doxx / paradox / ShibesAreGreat123 / 4111 1111 4555 1142 / 432
0day Montgomery	/ 0day /	OllieIsTheBestDog	/ 5555 3412 4444 1115 / 642
Muir Land / muirlandoracle/ A11D0gsAreAw3s0me /	5103 2219 1119 9245	/ 737

i tried ssh connection with these users and passwords but i couldn't do it.

but i did manage connect to an ftp server with paradox user and its possible to upload files and access them on the web server/page. :D

i tried a reverse shell with an msfvenom exploit but it wasn't working, so as a last attempt i tried using a php payload and it worked.

i logged in as apache, but the paradox user has the same password as the ftp server, but that user doesn't have a privilege either, i'm spending a lot of time doing a privilege escalation :D

and i couldn't do privilege escalation :( . So i needed to see a walkthrough but that still doesn't make any sense for me yet, i'll study more and one day i'll finish this challenge :D

The one flag that i found was the web flag, i just copied the location of the apache user from the /etc/passwd archive and the web.flag was there


//export TERM=xterm 






