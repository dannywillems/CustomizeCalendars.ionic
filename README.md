CustomizeCalendars [IN DEVELOPMENT ! NOT WORKING]
==================

DESCRIPTION
-----------
**CustomizeCalendars** let you customize your online shared calendars. It offers
you to choose which events you want to go to, and mofify the events name with
your own name without changing the original shared calendars values.

DEPENDENCIES
-----------
This hybrid mobile application is developed with Ionic. You need to install
Ionic with npm:
```
npm install -g ionic
```

There are some cordova plugin used. To install them, you can use:
```
ionic plugin add [plugin_name]
```

These plugins are:
- cordova-plugin-file
- cordova-plugin-file-transfer
- phonegap-plugin-barcodescanner
- calendar-plugin-calendar
- cordova-plugin-whitelist

BUILD AND INSTALL
-----------------
To avoid to repeat commands to type into the terminal, a shell script (buildAndroid.sh)
is available. It builds the application and move the apk (only for Android). If
adb is installed and if there's a Android device connected, it will install and
run the application.

You can use
```
./buildAndroid.sh
```
to execute the script.

You can change the output directory for the apk files and the version directly
in the build.sh file.

TODO
----
If you want to contribute to CustomizeCalendars, here some features to do.

- Home:
  - Center {{noCalendar}} when home is empty
- Settings:
  - Customize the design
  - Change the language
  - Automatic synchronisation
- Calendar:
  - Automatic synchronisation
- Data representation:
  - Think about a way to represent the time synchronisation

Coding standards
---------------
Coming soon
