#!/bin/sh

# This script is used to automatically deploy a worker with Angular front

cd webapp
ng build --prod # build webapp angular
cd ../worker/front
rm -v * # remove old symbolic link
ln -v -s ../../webapp/dist/zetapush-projects-overview/* ./ # create new symbolic link
cd ..
npm run deploy
