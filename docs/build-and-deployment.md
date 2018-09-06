HTW Mapper - Build and Deplyoment sheet


--------
## Development Machine Prerequisites
You can use a Windows, Linux or Mac based computer. <br>
__OS-Dependencies:__  Microsoft Windows  7/8/10 (32 or 64bit) or macOS a10.10 and higher or Gnome, KDE, Unity under Ubuntu or Fedora.




### Hardware:

+ minimal 3 GB RAM, 8 GB empfohlen; plus 1 GB for Android Emulator
+ minimal 5 GB free disk space,
+ USB 2.0+ interface




### Software:

+ CLI-Shell (unix-based or Windows)
+ Android Studio
+ NodeJS
+ Python 2 (Windows)
+ JDK + Android SDK (API Level 21)
+ React Native CLI
+ Yarn (recommended or NPM, comes along with NodeJS)



--------
## Deployment-Device Prerequistes
Basically, you can use any Android version 5.0 (or higher) based cellphone or tablet.

### Hardware:

+ GPS module
+ Wifi module
+ Bluetooth module
+ Micro USB or USB type C interface




### Software:

+ Android OS version 5.0 or higher
+ Enabled developer options
+ Enabled USB-Deubbing 


--------
## Additional technical depedencies
You can use and test functionality of the app evreywhere however the app will only work properly in a mapped area.
Mapped areas are (2018 March) HTW Berlin Campus Wilhelminenhof building C and H. For best localisation keep your Wifi module always on.

--------
## Build and Deploy Documentation

You only need to do one of the following setups once
### Setup Windows
For Windows, we strongly recommend using Chocolatey for replacing missing package managment.
+ Install Chocolatey [https://chocolatey.org/](https://chocolatey.org/)
+ Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command: 
`choco install -y nodejs.install python2 jdk8`
+ Run the following command in a Command Prompt or shell in order to install the React CLI:
`npm install -g react-native-cli`
+ Follow the steps on [React-Native Android Setup](https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment) in order to install Android studio properly.
+ Optional: Install yarn via `choco install yarn` and `choco upgrade yarn`


### Setup Linux
+ Install NodeJS based on your OS [https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
+ Open up a terminal and install the React-Native CLI via `npm install -g react-native-cli`
+ React Native requires a recent version of the Java SE Development Kit (JDK). [Download and install JDK 8 or newer if needed](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
+ Follow the steps on [React-Native Android Setup](https://facebook.github.io/react-native/docs/getting-started.html#1-install-android-studio) in order to install Android studio properly.
+ Optional: Install yarn via your package managment system.

### Setup Mac
+ [Open up your terminal and install Homebrew if you didn't already](https://brew.sh/)
+ Install NodeJS via `brew install node`
+ Install the React-Native CLI via `npm install -g react-native-cli`
+ React Native requires a recent version of the Java SE Development Kit (JDK). [Download and install JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
+ Follow the steps on [React-Native Android Setup](https://facebook.github.io/react-native/docs/getting-started.html#java-development-kit) in order to install Android studio properly (Android SDK 26 is recommended).

### Debug Build
The Debug Build comes with debugging features and will also display errors and warnings.

+ Open up a shell and change the directory to the root directory of the app (same as git root)
+ run `npm install` (or `yarn install`) to install the necessary depedencies of the app
+ Connect your Android device via USB with your computer <br>
_Note_ if you have a working ADB (Android debug bridge) installed, you can check whether your device is properly connected with
`adb devices`. Your device should show up in the terminal. 
+ Open up a second shell window and `cd` into the app root dir.
+ Start the React-Native-Development Server via `react-native start` (not for mac users - will start automatically within the next step)
+ In your inital shell window start the build and automated deploy with `react-native run-android`

+ Your computer should now build and deploy the app to your device. The app should autostart. <br>
**[Mac] Possible error** - script cannot load properly (red screen) or app crashes straight after the build, please have a look here: [Stackoverflow](https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows) 


### Release Build
The release build comes without debugging features and won't display errors and warnings. 
We will output a working apk at the end.

+ First uninstall any previous version on your device
+ Open up a shell and change the directory to the root directory of the app (same as git root)
+ run `cd android && ./gradlew assembleRelease` to bundle the app and build the apk
_Note_ You will find the apk under `android/app/build/outputs/apk/app-release.apk`
+ `cd ..` to go back into the app root dir
+ Deploy the release build on your device with `$ react-native run-android --variant=release`

--------
## Run-Documentation

The app will autostart after every successfull debug build. 
You can always run the app on your device via the installed app drawer on your device. 