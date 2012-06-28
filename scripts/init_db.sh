#!/bin/bash
echo "CREATE DATABASE keyserver CHARACTER SET utf8;" | mysql -uroot -p
echo "GRANT ALL ON keyserver.* TO nodeuser IDENTIFIED BY 'nodeuser';" | mysql -uroot -p
mysql -unodeuser -pnodeuser keyserver < schema.sql
