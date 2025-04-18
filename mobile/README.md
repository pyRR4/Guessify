Poradnik uruchomieniowy dla konfiguracji Windows 11, VS Code oraz Android SDK Manager zamiast Android Studio.

1. **Node.js** 
Pobierz i zainstaluj Node.js LTS: https://nodejs.org/en/download
Sprawdź, czy działa:

```bash
node -v
npm -v
```

2. **Java JDK 17**
https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
React Native wymaga JDK 17. Ustaw zmienną środowiskową JAVA_HOME na `C:\Program Files\Java\jdk-17`. Nie dodawaj \bin na końcu ścieżki.

3. **Android SDK Manager**
https://developer.android.com/studio?hl=pl#command-line-tools-only

Rozpakuj plik ZIP w folderze `C:\Android\sdk`. Zmień strukturę folderów na:

C:\Android\sdk\
└── cmdline-tools\
    └── latest\
        ├── bin\
        ├── lib\
        └── ...

Dodaj ścieżkę `C:\Android\sdk` do zmiennych środowiskowych jako ANDROID_HOME. 
Otwórz folder bin w terminalu. Uruchom:

```bash
.\sdkmanager --licenses --sdk_root="C:\Android\sdk"
```
i zatwierdź wszystkie zgody. Następnie:

```bash
 .\sdkmanager --sdk_root="C:\Android\sdk" "platforms;android-34" "build-tools;34.0.0" "ndk;21.3.6528147" "platform-tools"
```

Dodaj ścieżkę `C:\Android\sdk\platform-tools` do zmienej środowiskowej Path.

4. Zainstaluj React Native CLI

```bash
npm install -g react-native-cli
```
5. Zainstaluj zależności

```bash
npm install
```

6. Zbuduj i zainstaluj aplikację 
Włącz tryb programisty na telefonie z systemem Android.
Sprawdź, czy `adb` wykrywa telefon. W terminalu wpisz:

```bash
adb devices
```

Przejdź do katalogu `...\Guessify\mobile\Guessify` i uruchom:

```bash
npx react-native run-android
```

7. (Opcjonalnie) Podgląd logów aplikacji
```bash
adb logcat
```