# 🎶 TerraBeats

**TerraBeats** es una plataforma web para descubrir eventos de música en directo en España: conciertos, festivales, noches de club y más. Los usuarios pueden explorar eventos, filtrarlos por ciudad, artista, categoría o precio, verlos en un mapa interactivo y gestionar su propia cuenta.

El proyecto está construido con una **arquitectura MVC propia en PHP** (sin frameworks), una base de datos **MySQL** y un front end con **jQuery/AJAX**, con **autenticación basada en JWT** implementada desde cero.

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-PDO-4479A1?logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-jQuery-F7DF1E?logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-11-6332F6?logo=swiper&logoColor=white)

---

## ✨ Funcionalidades

### 🏠 Home
- Carruseles dinámicos (Swiper) cargados por AJAX: eventos destacados, categorías, artistas, ciudades, tipos de evento y **eventos más visitados**.
- Al hacer clic en cualquier elemento del carrusel, el usuario va a la tienda con el filtro correspondiente ya aplicado.

### 🛒 Shop (catálogo de eventos)
- Listado de eventos con **paginación en servidor**.
- **Filtros combinados**: artista, tipo de evento, ciudad, categorías (selección múltiple) y rango de precio.
- **Ordenación** (por ejemplo, más visitados) y estado de los filtros guardado en `localStorage`, de modo que se conserva al recargar la página.
- **Vista de detalle** del evento con galería de imágenes (Swiper) y un contador de visitas que alimenta el ranking de "más visitados".
- **Mapas interactivos con Leaflet + OpenStreetMap**: todos los eventos filtrados en un único mapa, o la ubicación exacta del recinto en la página de detalle.
- **Eventos relacionados** (misma ciudad / tipo) con mecanismo de "cargar más".

### 🔎 Search
- Selectores de ciudad y categoría dependientes entre sí.
- Buscador con **autocompletado** y sugerencias en tiempo real.

### 🔐 Autenticación y seguridad
- Registro e inicio de sesión con **validación por regex** en el cliente y comprobaciones en el servidor (usuario y email únicos).
- Contraseñas cifradas con **Argon2id** (`password_hash`).
- **JWT** implementado en PHP puro (HS256 / HMAC-SHA), con una vida útil de 10 minutos y **renovación automática del token**.
- **Control de inactividad de sesión** (cierre automático tras 30 minutos) y **regeneración periódica del ID de sesión**.
- Comprobación de coherencia token ↔ sesión en cada carga de página para detectar manipulaciones (`protecturl`).
- Todo el acceso a la base de datos mediante **sentencias preparadas de PDO**.

### 👤 Perfil de usuario
- Área protegida donde el usuario puede actualizar su **nombre de usuario** y/o su **contraseña**, con validación y mensajes de feedback con SweetAlert2.
- Avatar generado automáticamente a partir del nombre de usuario (RoboHash).

---

## 🧱 Arquitectura

La aplicación sigue un patrón MVC modular con un único controlador frontal:

```
index.php  ──►  view/inc/pages.php (router)  ──►  module/<nombre>/controller/controller_<nombre>.php
                                                         │
                                         ┌───────────────┴───────────────┐
                                         ▼                               ▼
                              module/<nombre>/model/DAO*.php   module/<nombre>/view/<nombre>.html
                              (acceso a datos, PDO)            (plantillas)
```

- **Controlador**: gestiona `?page=...&op=...` y devuelve JSON para las operaciones AJAX o incluye la vista.
- **Modelo (DAO)**: un objeto de acceso a datos por módulo, que aísla todo el SQL.
- **Vista**: plantillas HTML más JavaScript por módulo (`model/*.js`) que consume los controladores mediante un helper reutilizable `ajaxPromise`.

### Estructura del proyecto

```
terrabeats_MVC/
├── index.php                 # Controlador frontal
├── DB/
│   └── terrabeats.sql        # Esquema + datos de ejemplo
├── model/                    # Compartido: conexión a BD, JWT, middleware de auth
│   ├── connect.php
│   ├── JWT.php
│   └── middleware_auth.php
├── module/
│   ├── home/                 # Carruseles y eventos más visitados
│   ├── shop/                 # Catálogo, filtros, detalle, mapas, eventos relacionados
│   ├── search/               # Selects dependientes + autocompletado
│   ├── auth/                 # Registro, login, logout, control de token y sesión
│   └── profile/              # Gestión de la cuenta de usuario
└── view/
    ├── css/                  # Estilos
    ├── img/                  # Recursos estáticos
    ├── inc/                  # Parciales del layout (header, menú, footer, páginas de error)
    └── js/                   # Utilidades compartidas (promesas, actividad de sesión)
```

---

## 🗄️ Base de datos

Base de datos MySQL `terrabeats` con modelo relacional (InnoDB, claves foráneas con `ON DELETE CASCADE` en las tablas intermedias):

| Tabla | Descripción |
|---|---|
| `terra_events` | Eventos: nombre, fecha, hora, recinto, precio, estado, entradas, coordenadas (`lat`/`lng`), visitas |
| `cities`, `types`, `categories`, `artists` | Tablas de catálogo |
| `event_artists`, `event_categories` | Relaciones muchos a muchos con los eventos |
| `images`, `event_images` | Galería de imágenes de cada evento |
| `users` | Cuentas: usuario, contraseña cifrada, email, rol, avatar |

---

## 🚀 Puesta en marcha

### Requisitos
- PHP 8.x (con la extensión `pdo_mysql` y soporte para Argon2)
- MySQL / MariaDB
- Apache (XAMPP, WAMP, MAMP o similar)

### Instalación

1. **Clona el repositorio** en la raíz de tu servidor web, dentro de una carpeta `CRUD` (el proyecto usa esta ruta base internamente):

   ```bash
   cd /ruta/a/htdocs
   mkdir CRUD && cd CRUD
   git clone https://github.com/AlbaPastor53/TerraBeats.git terrabeats_MVC
   ```

2. **Crea la base de datos** e importa el esquema y los datos de ejemplo:

   ```bash
   mysql -u root -p -e "CREATE DATABASE terrabeats CHARACTER SET utf8mb4;"
   mysql -u root -p terrabeats < terrabeats_MVC/DB/terrabeats.sql
   ```

3. **Configura la conexión a la base de datos** en `model/connect.php` (host, usuario, contraseña y nombre de la base de datos).

4. **Crea el archivo de configuración JWT** `model/jwt.ini` con tu propio secreto:

   ```ini
   header = '{"typ":"JWT","alg":"HS256"}'
   secret = "cambia-esto-por-una-cadena-larga-y-aleatoria"
   ```

5. Arranca Apache y MySQL y abre:

   ```
   http://localhost/CRUD/terrabeats_MVC/
   ```

> ⚠️ No subas nunca `jwt.ini` ni credenciales reales al repositorio. Añade `model/jwt.ini` a tu `.gitignore`.

---

## 🛠️ Stack tecnológico

| Capa | Tecnologías |
|---|---|
| Back end | PHP (MVC propio), PDO, implementación propia de JWT |
| Base de datos | MySQL |
| Front end | HTML5, CSS3, JavaScript, jQuery, jQuery UI, AJAX (Promises) |
| Librerías | Swiper 11, Leaflet 1.9.4 + OpenStreetMap, SweetAlert2 |
| Fuentes / iconos | Google Fonts (Lexend, Syne, DM Sans), Material Symbols |

---

## 📸 Capturas de pantalla

<!-- Añade tus capturas a una carpeta /docs y enlázalas aquí -->
<!--
![Home](docs/home.png)
![Shop](docs/shop.png)
![Detalle del evento](docs/detail.png)
-->

---

## 🗺️ Roadmap

- [ ] Flujo de compra de entradas y carrito
- [ ] Favoritos / likes por usuario
- [ ] Panel de administración (CRUD de eventos, artistas y ciudades)
- [ ] Mover la configuración a variables de entorno
- [ ] Tests automatizados

---

## 👩‍💻 Autora

**Alba Pastor**
GitHub: [@AlbaPastor53](https://github.com/AlbaPastor53)

Proyecto desarrollado como parte de mis estudios de desarrollo web.
