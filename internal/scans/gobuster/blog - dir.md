
![](attachments/Pasted%20image%2020231022121655.png)
- it's a wordpress page and it has a lot of buttons that take you to another directories and pages.
- didn't have anything explicit there,it looks like a home page
- this page uses a strange cookie.
- had a login page at http://internal.thm/blog/wp-login.php

more directories:
```
/wp-content (Status: 301)
/wp-includes (Status: 301)
/wp-admin
```

in this link http://internal.thm/blog/index.php/comments/feed/ , an file is downloaded each time i reload and always with different name.

these files are a xlm and the one thing that i found in this was the version of the wordpress:
![](attachments/Pasted%20image%2020231022131701.png)
"v=5.4.2"

# /wp-content
```
/plugins
/plugins/index.php
/themes
```
but nothing is showed in web page so....

# /wp-includes
i don't have permission to see this directory.
![](attachments/Pasted%20image%2020231022125555.png)

# /wp-admin
if i try to access this i'm redirect to login page,so i need a login to see this page.

there is a few directories in this but isn't possible to access them.
```
/images (Status: 301)
/user (Status: 301)
/network (Status: 301)
/css (Status: 301)
/includes (Status: 301)
/js (Status: 301)
```




