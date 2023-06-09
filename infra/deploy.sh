#!/bin/bash

npm run build:client
cdk deploy --force --require-approval never --outputs-file ./deploy-artifacts/outputs.json