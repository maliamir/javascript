### Setup React Native

export ALL_PROXY=http://<proxy_host>:<proxy_port>

brew install watchman

sudo npm install -g react-native-cli

sudo npm install -g expo-cli

sudo npm install -g react-native-elements

sudo npm install -g react-native-table-component

sudo npm install -g react-native-vector-icons

react-native link react-native-vector-icons


For android emulator:

cd android

vi gradle.properties


Add below:

org.gradle.daemon=true

systemProp.http.proxyHost=<proxy_host>

systemProp.http.proxyPort=<proxy_port>

systemProp.https.proxyHost=<proxy_host>

systemProp.https.proxyPort=<proxy_port>