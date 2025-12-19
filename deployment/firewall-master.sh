ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp


# Autoriser tout le trafic sur l'interface loopback
ufw allow in on lo
ufw allow out on lo

# Autoriser le trafic venant des sous-réseaux des Pods et Services (par défaut sur K3s)
ufw allow from 10.42.0.0/16
ufw allow from 10.43.0.0/16

# Autoriser les noeuds agents
ufw allow from 192.168.1.88 to any port 6443 proto tcp
ufw allow from 192.168.1.88 to any port 8472 proto udp
ufw allow from 192.168.1.88 to any port 10250 proto tcp

ufw allow from 192.168.1.117 to any port 6443 proto tcp
ufw allow from 192.168.1.117 to any port 8472 proto udp
ufw allow from 192.168.1.117 to any port 10250 proto tcp

ufw default deny incoming