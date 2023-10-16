#!/bin/bash

sid=""
ip=""

for i in `seq 1000 1500`; do
	rpcclient -U 'user%password' -c "lookupsids $sid-$i;quit" $ip | cut -d ' ' -f2 
done


