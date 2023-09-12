### PWN ROOM's



===================================---===================================

nc $ip port

*PWN101

port = 9001

this first was very easy i just type a sequence of 'A' and got the shell so...but basically the program has
an variable called is1337 or something like this and if you overwrite this, the code give to you the shell ;D

$ ls -la
$ cat flag.txt

===================================---===================================

*PWN102

port = 9002

well,in this program, we need to organize the stack to bypass two compare operations to get the shell.
Because the program compare one var with "c0ff33" and another with "c0d3" if these two is true, take the shell.

python2 -c 'print("A")*104 + "\xd3\xc0\x00\x00" + "\x33\xff\xc0\x00"' | ./pwn102.pwn102

it took me a long time because this is compiled in 64bits and i'm not good in binary exploitatio and i couldn't get shell even with the correct input,so i add the cat after to see if it work and i get the flag

(python2 -c 'print("A")*104 + "\xd3\xc0\x00\x00" + "\x33\xff\xc0\x00"'; cat) | nc $ip port 


===================================---===================================

*PWN103

port = 9003


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




