#!/bin/bash

s3cmd --config=/Users/k/.s3bronsec  sync pub/. s3://www.bronsec.com --exclude '.DS_Store'
s3cmd setacl --config=/Users/k/.s3bronsec s3://www.bronsec.com/ --acl-public --recursive
