# QUICK GUIDE

1. Run
    ```
   cd GuesifyAPI
    mvn clean install -DskipTests
   ```
2. Create .env file with your data using template below
    ```
   # Aplikacja Spring Boot
    SPRING_PORT=
    
    # PostgreSQL
    POSTGRES_DB=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_PORT=
    
    # pgAdmin
    PGADMIN_PORT=
    PGADMIN_DEFAULT_EMAIL=
    PGADMIN_DEFAULT_PASSWORD=
    
    # Nazwy kontenerów
    POSTGRES_CONTAINER=
    PGADMIN_CONTAINER=
    SPRING_CONTAINER=
    
    # Spotify API
    SPOTIFY_ID=
    SPOTIFY_SECRET=
   ```
3. Run
    ```
    docker-compose up --build
   ```
   
Everything should work fine :D


# Endpoints

1. Authorization

   - ``api/auth/login`` - logowanie do Spotify
   - ``api/auth/callback`` - callback używany przez Spotify po pomyślnej autoryzacji