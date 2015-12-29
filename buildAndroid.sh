#!/bin/bash -
#===============================================================================
#
#          FILE: buildAndroid.sh
#
#         USAGE: ./buildAndroid.sh
#
#   DESCRIPTION: Build, install and run on a attached device the application. It
#   also copy the build in a apk directory with the date and hour corresponding
#   to keep the build. By default, it builds an android version.
#
#       OPTIONS: ---
#  REQUIREMENTS: ionic (configured), adb, Android Sdk.
#        AUTHOR: Danny Willems
#         EMAIL: contact@danny-willems.be
#       CREATED: 2015-09-11 12:15
#===============================================================================

set -o nounset                              # Treat unset variables as an error

CC=ionic
PLATFORM=android

VERSION=v.0.1
ID=com.customizecalendars.customizecalendars
PROJECT_NAME=CustomizeCalendars

LOCATION=$(pwd)
APK=$LOCATION/platforms/android/build/outputs/apk/android-debug.apk

OUTPUT=$(pwd)/apk
DATE=$(date +%Y%m%d.%H%M%S)

echo "-------------------------------------------------------------------------"
echo "Build application"
cd $LOCATION && $CC build $PLATFORM

echo "-------------------------------------------------------------------------"
echo "Make a copy in apk directory with date and hour"
mkdir -p $OUTPUT
cp $APK $OUTPUT/$PROJECT_NAME-$VERSION-$DATE.apk

echo "-------------------------------------------------------------------------"
echo "Install on attached device"
adb install -r $APK

echo "-------------------------------------------------------------------------"
echo "Run the application on the attached device"
adb shell am start -a android.intent.action.MAIN -n $ID/.$PROJECT_NAME
