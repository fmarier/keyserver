#!/bin/bash
sudo /sbin/chkconfig mysqld on
sudo /sbin/service mysqld start
echo "CREATE DATABASE keyserver CHARACTER SET utf8;" | mysql -uroot
echo "GRANT ALL ON keyserver.* TO 'nodeuser'@'localhost' IDENTIFIED BY 'nodeuser';" | mysql -uroot
echo "CREATE TABLE IF NOT EXISTS userkey ( id INT AUTO_INCREMENT, email VARCHAR(255) NOT NULL, wrappedkey VARCHAR(1024), PRIMARY KEY (id), UNIQUE (email));" | mysql -unodeuser -pnodeuser keyserver
