## Poradnik uruchomieniowy 
(dla konfiguracji Windows 11 + VS Code + Android SDK Manager)
## 1. Node.js
Pobierz i zainstaluj Node.js LTS: [Pobierz Node.js](https://nodejs.org/en/download)

Sprawdź, czy działa:

```bash
node -v
npm -v
```

## 2. Java JDK 17
Pobierz JDK 17 ze strony: [Pobierz JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

React Native wymaga JDK 17. Ustaw zmienną środowiskową `JAVA_HOME` na `C:\Program Files\Java\jdk-17`. 
Nie dodawaj `\bin` na końcu ścieżki.

## 3. Android SDK Manager
Pobierz tylko narzędzia wiersza poleceń SDK: [Android SDK Command Line Tools](https://developer.android.com/studio?hl=pl#command-line-tools-only)

Rozpakuj plik ZIP w folderze `C:\Android\sdk`. Zmień strukturę folderów na:

```
C:\Android\sdk\
└── cmdline-tools\
    └── latest\
        ├── bin\
        ├── lib\
        └── ...
```

Dodaj ścieżkę `C:\Android\sdk` do zmiennych środowiskowych jako `ANDROID_HOME`. 

Otwórz folder `bin` w terminalu i uruchom:

```bash
.\sdkmanager --licenses --sdk_root="C:\Android\sdk"
```

Zatwierdź wszystkie zgody.

Następnie zainstaluj wymagane pakiety:

```bash
.\sdkmanager --sdk_root="C:\Android\sdk" "platforms;android-34" "build-tools;34.0.0" "ndk;21.3.6528147" "platform-tools"
```

Dodaj ścieżkę `C:\Android\sdk\platform-tools` do zmiennej środowiskowej `Path`.

## 4. Zainstaluj React Native CLI

Zainstaluj globalnie React Native CLI:

```bash
npm install -g react-native-cli
```

## 5. Zainstaluj zależności

Zainstaluj zależności projektu:

```bash
npm install
```

## 6. Zbuduj i zainstaluj aplikację

1. Włącz tryb programisty na telefonie z systemem Android.
2. Sprawdź, czy `adb` wykrywa telefon:

    ```bash
    adb devices
    ```

3. Przejdź do katalogu `...\Guessify\mobile\Guessify` i uruchom aplikację:

    ```bash
    npx react-native run-android
    ```
