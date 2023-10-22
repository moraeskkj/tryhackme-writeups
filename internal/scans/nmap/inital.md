```
Starting Nmap 7.80 ( https://nmap.org ) at 2023-10-22 11:22 PDT
Initiating Ping Scan at 11:22
Scanning internal.thm (10.10.92.78) [4 ports]
Completed Ping Scan at 11:22, 0.26s elapsed (1 total hosts)
Initiating SYN Stealth Scan at 11:22
Scanning internal.thm (10.10.92.78) [65535 ports]
Discovered open port 80/tcp on 10.10.92.78
Discovered open port 22/tcp on 10.10.92.78
SYN Stealth Scan Timing: About 19.56% done; ETC: 11:25 (0:02:07 remaining)
SYN Stealth Scan Timing: About 22.32% done; ETC: 11:27 (0:03:32 remaining)
SYN Stealth Scan Timing: About 26.75% done; ETC: 11:28 (0:04:09 remaining)
SYN Stealth Scan Timing: About 29.73% done; ETC: 11:29 (0:04:46 remaining)
SYN Stealth Scan Timing: About 36.89% done; ETC: 11:30 (0:05:10 remaining)
SYN Stealth Scan Timing: About 47.18% done; ETC: 11:30 (0:03:56 remaining)
SYN Stealth Scan Timing: About 54.71% done; ETC: 11:30 (0:03:29 remaining)
SYN Stealth Scan Timing: About 64.91% done; ETC: 11:31 (0:03:05 remaining)
SYN Stealth Scan Timing: About 72.75% done; ETC: 11:32 (0:02:37 remaining)
Increasing send delay for 10.10.92.78 from 0 to 5 due to max_successful_tryno increase to 4
SYN Stealth Scan Timing: About 81.70% done; ETC: 11:34 (0:02:08 remaining)
SYN Stealth Scan Timing: About 87.61% done; ETC: 11:35 (0:01:31 remaining)
SYN Stealth Scan Timing: About 93.15% done; ETC: 11:35 (0:00:53 remaining)
Completed SYN Stealth Scan at 11:37, 878.09s elapsed (65535 total ports)
Nmap scan report for internal.thm (10.10.92.78)
Host is up, received echo-reply ttl 63 (0.32s latency).
Scanned at 2023-10-22 11:22:43 PDT for 878s
Not shown: 65532 closed ports
Reason: 65532 resets
PORT      STATE    SERVICE REASON
22/tcp    open     ssh     syn-ack ttl 63
80/tcp    open     http    syn-ack ttl 63
40720/tcp filtered unknown no-response

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 878.46 seconds
           Raw packets sent: 71110 (3.129MB) | Rcvd: 77768 (4.324MB)

```