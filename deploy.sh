#!/bin/bash

SITE_ROOT=/srv/http/ # Where does the site live

rm -rf public/*

hexo generate
POST=$(cat public/index.html)
sed -i -e '/<!--StartHexo-->/,/<!--EndHexo-->/c\<!--StartHexo-->\n'"$POST"'\n<!--EndHexo-->' $SITE_ROOT/index.html
cp -r public/20* $SITE_ROOT
cp -r public/archives $SITE_ROOT 
cp -r public/img $SITE_ROOT 
cp -r public/css/* $SITE_ROOT/css/ 
