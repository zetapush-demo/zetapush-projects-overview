#!/bin/sh

# This script is used to automatically deploy a worker with Angular front

cd webapp
echo "Building Angular webapp..."
ng build --prod # build webapp angular
cd ../worker/front
ln -vfs ../../webapp/dist/zetapush-projects-overview/* ./ # create new symbolic link (and remove existing symbolic link)
cd ..
npm run deploy
