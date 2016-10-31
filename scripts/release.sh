#!/bin/sh

set -ex

npm run build
npm pack
rm -rf dist
mkdir dist
mkdir -p release
mv fe-*.tgz dist/pack.tgz

cd dist
umask 0022 # Ensure permissions are correct (0755 for dirs, 0644 for files)
tar -xzf pack.tgz --strip 1
rm -rf pack.tgz
# npm install --production
yarn install --production
rm -rf node_modules/*/test
cd ..

tar -cvzf release/fe-v`dist/bin/fe --version`.tar.gz dist/*
shasum -a 256 release/fe-*.tar.gz
