#!/bin/bash

export HOME=/home/ec2-user
echo $HOME;

source ~/.bashrc

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

node -v

npm i pm2 -g

export $(cat ./.env | xargs)

pm2 start ./server.js --name server