# FrenzyFilms

FrenzyFilms es una aplicación web para la gestión de una cartelera de cine, construida con Spring Boot y Angular. 
Permite importar películas desde TMDb, administrar sesiones, entradas, y gestionar usuarios con autenticación JWT.

## Tecnologías
- Java + Spring Boot
- Spring Security + JWT
- Angular (frontend)
- PostgreSQL (base de datos)
- TMDb API (películas)
- Swagger (documentación)

## Características
- Importación de películas desde TMDb
- CRUD de películas, salas, sesiones y entradas
- Roles diferenciados: administrador y usuario
- Seguridad JWT en todas las rutas protegidas
- Correos automáticos al cancelar sesiones
- Documentación Swagger UI

## Rutas clave
- `/login` - autenticación
- `/peliculas/cartelera` - ver películas activas
- `/tmdb/buscar?titulo=X&pagina=Y` - buscar películas en TMDb
- `/entradas` - crear, ver y cancelar entradas
- `/admin` - gestión del perfil de administrador

## Cómo ejecutar
1. Configura la base de datos PostgreSQL
2. Agrega tu clave TMDb en `application.properties`
3. Ejecuta el backend con Spring Boot
4. Usa Swagger para explorar la API
