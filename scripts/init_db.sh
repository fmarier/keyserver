#!/bin/bash
echo "CREATE DATABASE keyserver CHARACTER SET utf8;" | mysql -uroot
echo "GRANT ALL ON keyserver.* TO nodeuser IDENTIFIED BY 'nodeuser';" | mysql -uroot
mysql -unodeuser -pnodeuser keyserver < schema.sql
