echo "----------------"
echo "update cordova"
echo "----------------"
npm update -g cordova
cordova -v
echo "----------------"
echo "update platform"
echo "----------------"
cordova platform update android
cordova platform update browser
echo "----------------"
cordova platform ls