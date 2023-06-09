#!/bin/bash

npm run build:server

cp ./dist/server.js ./ec2-fleet-launch-bucket/server.js
cp ./infra/assets/.env ./ec2-fleet-launch-bucket/.env
cp ./infra/assets/appspec.yml ./ec2-fleet-launch-bucket/appspec.yml
cp ./infra/assets/start-server.sh ./ec2-fleet-launch-bucket/start-server.sh
cp ./infra/assets/stop-server.sh ./ec2-fleet-launch-bucket/stop-server.sh
zip -r ./ec2-fleet-launch-bucket/source.zip ./ec2-fleet-launch-bucket

aws s3api put-object --bucket server-template.jackbliss.co.uk.testfleet.launch --key source.zip --body ./ec2-fleet-launch-bucket/source.zip