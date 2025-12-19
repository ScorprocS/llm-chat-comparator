# On the AGENT node:
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
sudo ufw allow from 192.168.1.44 to any port 8472 proto udp
sudo ufw allow from 192.168.1.44 to any port 10250 proto tcp

ufw default deny incoming