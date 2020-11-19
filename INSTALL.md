# Roteiro de implantação da API Loterias - ambiente de produção

# Scripts de instalação do servidor

## Atualização do servidor (root)

```bash
apt update && apt upgrade -y
reboot
```

## Criação do usuário de deploy da aplicação (root)

```bash
useradd -m -G sudo -s /bin/bash deploy
passwd deploy
mkdir /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
```

A partir de agora todos os comandos serão executados pelo usuário deploy

## Instalação do Node.js v14.x e Yarn v1.x

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y --no-install-recommends yarn
```

## Clonagem do repositório GitHub

Primeiro será necessário criar uma chave SSH no servidor:

```bash
ssh-keygen # pressionar ENTER para todas as opções
```

Em seguida, copiar o conteúdo da chave pública:

```bash
cat ~/.ssh/id_rsa.pub # copiar o retorno do comando
```

No GitHub, vá em **Settings** **→ SSH and GPG Keys → New SSH Key**, e cole o conteúdo da chave pública no campo **Key**. Forneca também um título para a chave em **Title**.

Agora, faça o clone do repositório:

```bash
mkdir ~/app
cd ~/app
git clone git@github.com:felixmediabr/loterias-backend-api.git
```

Instalar as dependências e criar a build de produção:

```bash
cd loterias-backend-api/
yarn && yarn build
```

Renomear os arquivos de configuração de exemplo:

```bash
mv .env.sample .env
mv ormconfig.json.sample ormconfig.json
```

# Docker

## Configurando Docker para o usuário deploy

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

## Instalação e configuração do MongoDB

Defina uma senha para o MongoDB

```bash
docker run -d --name mongodb -e MONGODB_USERNAME=loterias -e MONGODB_PASSWORD={DEFINIR_SENHA} -e MONGODB_DATABASE=loterias -p 32768:27017 --restart=unless-stopped bitnami/mongodb:latest
```

Edite o arquivo `~/app/loterias-backend-api/ormconfig.json`, inserindo os dados de conexão do MongoDB. Atentar para alteração do atributo `entities` para a pasta `dist/` e arquivos `*.js`.

Para testar a conexão MongoDB:

```bash
curl http://localhost:32768
# Deve retornar *It looks like you are trying to access MongoDB over HTTP on the native driver port.*
```

Por fim, configurar o arquivo `.env` e verificar se o servidor executa sem erros:

```bash
cd ~/app/loterias-backend-api/
node dist/server.js
# Deve aparecer a mensagem *Server running on port XXXX...*
```

# Nginx

## Instalação do Nginx

```bash
sudo apt install nginx -y
sudo ufw allow 80   # liberação da porta HTTP no firewall
sudo ufw allow 443  # liberação da porta HTTPS no firewall
```

## Configuração do Nginx

Faça uma cópia do arquivo de exemplo:

```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/loterias
```

Edite o arquivo de acordo com as instrução da DigitalOcean:

[How To Set Up a Node.js Application for Production on Ubuntu 20.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04#step-4-—-setting-up-nginx-as-a-reverse-proxy-server)

Após a edição, ative o novo arquivo de configuração e faça um teste:

```bash
sudo ln -s /etc/nginx/sites-available/loterias /etc/nginx/sites-enabled/loterias
sudo rm -rf /etc/nginx/sites-enabled/default
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Reinicie o Nginx:

```bash
sudo service nginx reload
sudo service nginx restart
```

# PM2

## Instalação e execução do PM2

```bash
sudo npm install -g pm2
cd ~/app/loterias-backend-api/
pm2 start dist/server.js --name loterias-api
```

## Comandos úteis

```bash
pm2 list # lista as aplicações em execução
pm2 logs # log das aplicações
pm2 monit # abre um monitor das aplicações para visualização
pm2 save # salva as aplicações em execução para reinício automático
```

## Configurar PM2 para iniciar automaticamente

```bash
pm2 startup systemd
# Execute as instruções indicadas no retorno do comando.
```

# Cetificado SSL

Utilizar Let's Encrypt:

[Certbot - Ubuntufocal Nginx](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx)

# Scripts de execução automática

## Instalar interpretador JSON jq

```bash
sudo apt install jq -y
```

Executar script `src/run-lottery.sh nome_da_loteria` (alterar antes os parâmetros do TOKEN e porta do script)
