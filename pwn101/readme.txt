### PWN ROOM's

https://tryhackme.com/room/pwn101

===================================---===================================

*PWN101

port = 9001

$ nc $ip port


this first was very easy i just type a sequence of 'A' and got the shell so...but basically the program has
an variable called is1337 or something like this and if you overwrite this, the code give to you the shell ;D

$ ls -la
$ cat flag.txt

===================================---===================================

*PWN102

port = 9002

$ nc $ip $port

well,in this program, we need to organize the stack to bypass two compare operations to get the shell.
Because the program compare one var with "c0ff33" and another with "c0d3" if these two is true, take the shell.

python2 -c 'print("A")*104 + "\xd3\xc0\x00\x00" + "\x33\xff\xc0\x00"' | ./pwn102.pwn102

it took me a long time because this is compiled in 64bits and i'm not good in binary exploitatio and i couldn't get shell even with the correct input,so i add the cat after to see if it work and i get the flag

(python2 -c 'print("A")*104 + "\xd3\xc0\x00\x00" + "\x33\xff\xc0\x00"'; cat) | nc $ip port 


===================================---===================================

*PWN103

port = 9003

$ nc $ip $port

so,after it took me a few time, i see that program has a adminonly function but her is not called by anyone,so, i think that this program has a buffer leak on some input. I found a bufferoverflow in read input in general channel, i think that i need to manipule stack to go to adminonly function ;D

0x3562413462413362

the return address is after fourty bytes

admins_only_function_address = 0x000000401554 

looks like the address function doesn't change so its make more easy to exploit 

python2 -c 'print("A"*40 + "\x54\x15\x40\x00\x00\x00")'

basically this,but i think that i'll need to python with pwn tools because first i need to insert 3 and give the this input after this.

i did the exploit but when i got the shell, i couldn't receive output to my commands and my connection was closed after my first command.

it's because of the movaps issue or stack alignment,so i don't understand very well of why i need this but, this error can be fixed by a add one more return address(main ret) to payload.

so,the code read buffer and the return address send the code to a another ret instruction that will call the admins_only address :D.

4141414141
4141414141
4141414141
0000890182 - return to ret instruction in main function
0000820371 - the return address that ret instruction in main will use


===================================---===================================

*PWN104

port = 9004

$ nc $ip port

when i execute this program he says,"I think i have super powers especially executable powers"

lets go see the with checksec.

	Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX disabled
    PIE:      No PIE (0x400000)
    RWX:      Has RWX segments

i mean that's will be easy...

the only thing that the program do is a some printf's and asks an input with read function.

i don't found any win function so i mean i will use an reverse payload or anything like this

using the pattern generator i found the number of bytes i need to arrive the return address in stack

pattern_RIP = 0x3164413064413963
buffer = 88bytes

so, i got the payload,address to payload and the number of bytes to overwrite the return address.

payload + buffer + adress_to_payload = exploit

but i needed to get the adress to payload at runtime,so i had to create a xpl.py

it took me a few time because i don't know so much of python and i was having a lot of erros :D

===================================---===================================

*PWN105

port = 9005

$ nc $ip port

this program is calculator, he asks for two numbers and sum both.

i tried a few inputs and it seems that when i sent a word or letter, an error occurs.

i'll use idapro to dissasemble the file and analyzing the code and i'll follow the execution with edb debugger :D

using the these two together makes it very easy to understand what's going on in execution, i learned this trick with @hackingnaweb, he is a very smart and a good teacher :D

IT TOOK ME AGES TO DISCOVER HOW TO GET SHELL WTFFFF

the input read just 1 byte,and if you try to enter a negative number he exit the program, but the program has a "if" that compare the sum of the two inputs(i mean,maybe i dont know what was the one var until today...), if the sign flag is true or the result is negative, is made an jump and the shell is popped. 
so, after a long time to understand it, i took just 2 min to discover the final.
i was trying insert a letter in input, but didn't work no way. So an lamp lit up in my brain and i remember that if i sum two giant numbers probably i'll break the MAX_VALUE and worked.

[rbp-0x~] = sum of the two numbers

how the two numbers are positive, the "if" let me pass and when the program makes " cmp [rbp-0xc],0 " , what actually happens is 0 - [rbp-0xc], this active the sign flag and the program give the shell to me.

===================================---===================================

*PWN106

$ nc $ip port

this program just ask for a username and response with your input, but i remembered that i read about format string vulnerability in the room information, so, if you type a few: %x.%x.%x.%x will receive a some of address in stack, i think that this challenge will take to me a long time because i never understand very well how to exploit a format string but, it's worth a try( i learned this expression today :D)


AAAA.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x.%x

i sended this to found the position in stack that my input will be

output: AAAA.310192c0.0.0.e8f52380.aea5caf0.7b4d4854.67616c66.65746361.7d58.41414141.252e7825.2e78252e.78252e78.252e7825.2e78252e.

as can you see, the tenth position contains 41414141 :D

    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled

i think i'm fucked...

no, i'm not because i went to see the hex dump and i found the flag but i wanna to exploit with the right way (note1: i was wrong,this isn't the flag note2: i was wrong again, this is the flag but i need to find in real server)

00007fff:cf9a8930|5b5858587b4d4854|THM{XXX[|
00007fff:cf9a8938|6465725f67616c66|flag_red|
00007fff:cf9a8940|58585d6465746361|acted]XX|
00007fff:cf9a8948|0000000000007d58|X}......|

so... i don't know, i can't make anything with this. it's not a address. i couldn't found anything moreover. i think that using a offsets to get functions from LIBC ??

i'm so stupid :D it's obvious that this is the "real" flag, but i need to see it in the real server too.

i took a few time to make this exploit.py because i'm real blind in py, so i went to search how can i make this and i found this video( Leaking Values with printf (Format String Vuln) - Search Engine - [Intigriti 1337UP LIVE CTF 2022] ) from CryptoCat. this guy help me a lot 

i don't like to just coping and pasting code so i add some comments because i took a while to discover how this code works


===================================---===================================

*PWN107

$ nc $ip port

'''
    [*] '/home/akame/Desktop/ctf/tryhackme/pwn/pwn107/pwn107.pwn107'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enable
'''

omg....ok, i took a look with ida in the binary file and what this program do,there are some printf's read's and the program has a canary protection function, so i think this can be a format string again,then...

i'm going to look with edb debugger to be sure, but if its, i think what i'll do is just use the last code again.

nop, i couldn't see anything but i found an get_streak function,this function calls system('/bin/sh')

i mean, maybe use %n to redirect to this function? i dunno if it will work, but it's worth a try !

nop,i understand what i need to do

with format string i can get information from stack and use it to make a bufferoverflow in the second read in program

first i need to discover how can i get the win function adress and an ret instruction adress in execution time with format string.
after this, i need to discover wich position canary is in.

save this all and makes a buffer overflow :)

canary normally ends with 0x00 so it don't took much time to discovered by me

now i'm going get the offset and the bases adress. 

this video help me understand how to do this

8: Leak PIE (bypass) and Lib-C (ret2system) - Buffer Overflows - Intro to Binary Exploitation (Pwn) from Crypto Cat.

OMG I FINALLY UNDERSTAND THIS SHIT OMG 

i was wrong(as i always am :D ), i tought that the canary is in four position in stack leak but i was wrong,this positions had an address to aleatory ret instruction and a little bit more down had main address


# LOCAL
%4$p - address to ret instruction
%13$p - canary
%17$p - address to main function

# REMOTE

%13$p - canary
%19$p - main 

main - 0x46(decimal = 70) = win_func()
main + 0x16e(decimal = 136) = ret instruction

i'm so happy omg

fuck, in remote server doesn't work :( , probaly that the addresses doesn't match and is so boring to find without a debbuger

after a lot of tries, i was able to exploited but i was receiving EOF error when i sent any command. I knew that this was because the movaps issue and i was needed an ret instruction to bypass this, but i couldn't found the correct address in stack so, i calculated the offset of this instruction,and it works!!!!!!

FINALLY I FINISHED THIS CHALLENGE OMG LET'S GO TO THE PENULTIMATE ONE NOW


===================================---===================================

*PWN108

$ nc $ip port


'''
[*] '/home/akame/Desktop/ctf/tryhackme/pwn/pwn108/pwn108.pwn108'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
'''

ok, at least this doesn't have pie  :)


string format vulnerability and a holiday function that calls system('/bin/sh'),

the first read function has an buffer to 18bytes and the second read has an buffer more bigger than first,but i couldn't make a bufferoverflow in both so this doesn't matter i think

format string vulnerability is really hard omg

what i did was, overwriting the got address with format string.

the most hard thing to do is write the payload in the correct way but pwntools can allow you with this.

# payload = fmtstr_payload(offset, {elf.got['puts'] : elf.sym['holidays']})


offset is wich position your input is in stack, second input is which address you wanna overwrite and the third is wich new address you wanna write.

or

putsaddr%4198971d6$lln

4198971 = holidayaddr_as_a_integer
d = decimal
6 = offset


===================================---===================================

*PWN108

port = 9008

$ nc $ip port

[*] '/home/akame/Desktop/ctf/tryhackme/pwn/pwn109/pwn109.pwn109'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000

i think that,it's a simple buffer overflow....but i don't know, i always am wrong so...maybe it'll take longer than i think hahah

let's go

first i'm going to find how many bytes i need to reach the return addres and i'm going analyze this with edb and ida too.

i use this site to find the buffer :)

https://wiremask.eu/tools/buffer-overflow-pattern-generator/

the site returns to me forty bytes, i'm going test this now

$ python2 -c 'print("A"*40 + "BBBBBBBB")' 

just to clear my head i analyze the binary with ida but doesn't have any function win or something like this so,i need to do this manual :)

maybe its more easy to make this with ROPgadget but i don't remember so i'll try to make alone and manualy
 
and i was wrong again and it took three days to me :D but i win and i'm going to explain now

then,we got a buffer overflow,but this binary has nx protection and alsr.
What can we do?

we can use the functions in got and plt to leak a few address and we'll use it to find wich version to LibC is running :D

i use gets function to find the libC but you could use puts too.
i got a lot of errors when i used puts so...

you can find the got and plt addresses using pwn tools, we don't have pie then if you want to put hardcoded you could too

we'll manipulate the rdi register to put an argument to puts function and finally get one leak 


payload struct = [
    buffer_to_reach_ret,
    pop_rdi_and_ret,
    gets_addr_in_got,
    puts_addr_in_plt,
    main_plt_addr
]

the pop_rdi_ret will send the address to get to rdi register and then,as the pop instruction removes a value from the stack the return address will be the puts function. The Puts function will take the value of the rdi register as a argument and we'll get a leak with this way

after all, the main thing is just to make sure the program doesn't crash :)

so, now we got an leak to gets function, how can we find the libC?

https://libc.blukat.me

this site can help us with this!

$ wget https://libc.blukat.me/d/libc6_2.27-3ubuntu1.4_amd64.so

we found the libC and downloaded her to use in exploit

to find where the libC start just make a basic math

libc.address = gets_leak_address - libc.symbol['gets']

i don't know exactly why but the variable name needs of the dot to exploit works fine

after this point is easy, we just need to find system function and the string /bin/sh

bin_sh = next(libc.search(b"/bin/sh")) 
system = libc.symbols['system']

next is because the search function returns an list and and we just need to take the first element 

so, now is time to make another payload

the main is running again and is wait for us input again

payload2 = [
    buffer,
    ret,
    pop_rdi_ret,
    bin_sh_str,
    system,
]

same logic than before, but now we'll call the shell to us.

ret in this payload is because the movaps issue,maybe you don't need but my exploit only works fine with this


===================================---===================================

*PWN110

port = 9010

$ nc $ip port

'''
[*] '/home/akame/Desktop/ctf/tryhackme/pwn/pwn110/pwn110.pwn110'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
'''

ok,canary,aslr and nx enabled but no pie, ok, let's execute it

'''
       ┌┬┐┬─┐┬ ┬┬ ┬┌─┐┌─┐┬┌─┌┬┐┌─┐
        │ ├┬┘└┬┘├─┤├─┤│  ├┴┐│││├┤ 
        ┴ ┴└─ ┴ ┴ ┴┴ ┴└─┘┴ ┴┴ ┴└─┘
                 pwn 110          

Hello pwner, I'm the last challenge 😼
Well done, Now try to pwn me without libc 😏
$ hahahahahahhahahahahahahahahhahahahahahahhahahahahahahahhahahahahahahahahaa
[1]    99116 segmentation fault  ./pwn110.pwn110
'''
after a few time analyzing the program i couldn't found any function that help me with something

maybe this is the hardest but it's ok.

i searched a lot and maybe i need to disable the protections with some way, but i don't know how yet.

i saw some peoples saying that found a system function in binary and manipulate the regs to call /bin/sh but i couldn't find it at all so maybe disable protections it's the ""right way"" to do this