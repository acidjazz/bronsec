#!/bin/bash


s3cmd --config=$HOME/.s3bronsec  sync pub/. s3://www.bronsec.com --exclude '.DS_Store'
s3cmd setacl --config=$HOME/.s3bronsec s3://www.bronsec.com/ --acl-public --recursive
