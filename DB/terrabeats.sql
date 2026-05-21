-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 21-05-2026 a las 12:37:11
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `terrabeats`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `artists`
--

DROP TABLE IF EXISTS `artists`;
CREATE TABLE IF NOT EXISTS `artists` (
  `id_art` int NOT NULL AUTO_INCREMENT,
  `name_art` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_art` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_art`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `artists`
--

INSERT INTO `artists` (`id_art`, `name_art`, `img_art`) VALUES
(1, 'maneskin', 'view/img/home/artists/maneskin.jpg'),
(2, 'morat', 'view/img/home/artists/Morat.jpg'),
(3, 'arde_bogota', 'view/img/home/artists/Arde_bogotá.jpg'),
(4, 'olivia_rodrigo', 'view/img/home/artists/Olivia.jpg'),
(5, 'marshmello', 'view/img/home/artists/marsh.jpg'),
(6, 'arctic_monkeys', 'view/img/home/artists/articmonkeys.jpg'),
(7, 'natalia_lacunza', 'view/img/home/artists/Natalia_Lacunza.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_cat` int NOT NULL AUTO_INCREMENT,
  `name_cat` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_cat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id_cat`, `name_cat`, `img_cat`) VALUES
(1, 'electronic', 'view/img/home/category/electronic.jpg'),
(2, 'rock', 'view/img/home/category/rock.jpg'),
(3, 'pop', 'view/img/home/category/pop.jpg'),
(4, 'indie', 'view/img/home/category/indie.png'),
(5, 'acoustic', 'view/img/home/category/acoustic.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities` (
  `id_city` int NOT NULL AUTO_INCREMENT,
  `name_city` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_city`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cities`
--

INSERT INTO `cities` (`id_city`, `name_city`, `img_city`) VALUES
(1, 'madrid', 'view/img/home/city/madrid.jpg'),
(2, 'barcelona', 'view/img/home/city/barcelona.jpg'),
(3, 'valencia', 'view/img/home/city/valencia.jpg'),
(4, 'sevilla', 'view/img/home/city/sevilla.jpg'),
(5, 'bilbao', 'view/img/home/city/bilbao.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_artists`
--

DROP TABLE IF EXISTS `event_artists`;
CREATE TABLE IF NOT EXISTS `event_artists` (
  `id_terra` int NOT NULL,
  `id_art` int NOT NULL,
  PRIMARY KEY (`id_terra`,`id_art`),
  KEY `fk_ea_art` (`id_art`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_artists`
--

INSERT INTO `event_artists` (`id_terra`, `id_art`) VALUES
(1, 1),
(9, 1),
(13, 1),
(16, 1),
(1, 2),
(3, 2),
(7, 2),
(17, 2),
(5, 3),
(8, 3),
(12, 3),
(19, 3),
(2, 4),
(5, 4),
(11, 4),
(17, 4),
(2, 5),
(4, 5),
(10, 5),
(14, 5),
(20, 5),
(6, 6),
(9, 6),
(16, 6),
(8, 7),
(12, 7),
(15, 7),
(18, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_categories`
--

DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id_terra` int NOT NULL,
  `id_cat` int NOT NULL,
  PRIMARY KEY (`id_terra`,`id_cat`),
  KEY `fk_ec_cat` (`id_cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_categories`
--

INSERT INTO `event_categories` (`id_terra`, `id_cat`) VALUES
(1, 1),
(10, 1),
(14, 1),
(20, 1),
(5, 2),
(6, 2),
(9, 2),
(13, 2),
(16, 2),
(4, 3),
(7, 3),
(8, 3),
(11, 3),
(17, 3),
(1, 4),
(3, 4),
(6, 4),
(8, 4),
(12, 4),
(15, 4),
(17, 4),
(19, 4),
(2, 5),
(5, 5),
(7, 5),
(12, 5),
(15, 5),
(18, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_images`
--

DROP TABLE IF EXISTS `event_images`;
CREATE TABLE IF NOT EXISTS `event_images` (
  `id_terra` int NOT NULL,
  `id_img` int NOT NULL,
  PRIMARY KEY (`id_terra`,`id_img`),
  KEY `fk_eim_img` (`id_img`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_images`
--

INSERT INTO `event_images` (`id_terra`, `id_img`) VALUES
(1, 1),
(5, 1),
(6, 1),
(2, 2),
(3, 2),
(11, 2),
(17, 2),
(3, 3),
(14, 3),
(1, 4),
(3, 4),
(4, 4),
(9, 4),
(19, 4),
(5, 5),
(20, 5),
(6, 6),
(11, 6),
(13, 6),
(16, 6),
(20, 6),
(7, 7),
(8, 7),
(12, 7),
(17, 7),
(8, 8),
(13, 8),
(19, 8),
(9, 9),
(12, 9),
(16, 9),
(18, 9),
(10, 10),
(14, 10),
(15, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `id_img` int NOT NULL AUTO_INCREMENT,
  `ruta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_img`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`id_img`, `ruta`) VALUES
(1, 'view/img/home/events/concierto.jpg'),
(2, 'view/img/home/events/festi1.jpg'),
(3, 'view/img/home/events/festi4.jpg'),
(4, 'view/img/home/events/festi2.jpg'),
(5, 'view/img/home/events/concierto2.jpg'),
(6, 'view/img/home/events/festi5.jpg'),
(7, 'view/img/home/events/festi6.jpg'),
(8, 'view/img/home/events/festi7.jpg'),
(9, 'view/img/home/events/outdoor1.jpg'),
(10, 'view/img/home/events/club1.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terra_events`
--

DROP TABLE IF EXISTS `terra_events`;
CREATE TABLE IF NOT EXISTS `terra_events` (
  `id_terra` int NOT NULL AUTO_INCREMENT,
  `name_event` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_time` time NOT NULL,
  `id_city` int NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_type` int NOT NULL,
  `venue_capacity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('scheduled','live','finished','cancelled','sold out') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tickets_available` int NOT NULL,
  `sponsors` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL,
  `visits` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_terra`),
  KEY `fk_event_city` (`id_city`),
  KEY `fk_event_type` (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `terra_events`
--

INSERT INTO `terra_events` (`id_terra`, `name_event`, `description`, `organization`, `event_date`, `event_time`, `id_city`, `location`, `id_type`, `venue_capacity`, `price`, `status`, `tickets_available`, `sponsors`, `ticket_type`, `img`, `lat`, `lng`, `visits`) VALUES
(1, 'Terra Beats Festival', 'Electronic music festival with top DJs.', 'TerraBeats Org', '2026-07-15', '18:00:00', 1, 'IFEMA Madrid', 1, 30000, 89.99, 'scheduled', 15000, 'Red Bull, Pioneer DJ', 'General', 'view/img/home/events/concierto.jpg', 40.4719000, -3.6086000, 6),
(2, 'Latin Night Live', 'A night full of Latin rhythms.', 'UrbanSound', '2026-05-20', '21:30:00', 2, 'Palau Sant Jordi', 2, 18000, 59.50, 'live', 5000, 'Coca-Cola', 'VIP', 'view/img/home/events/festi1.jpg', 41.3579000, 2.1499000, 0),
(3, 'Techno Underground', 'Techno event with international artists.', 'DarkRoom Events', '2026-04-10', '23:00:00', 3, 'Fabrika Valencia', 3, 5000, 35.00, 'sold out', 0, 'Heineken', 'General', 'view/img/home/events/festi4.jpg', 39.4669000, -0.3763000, 4),
(4, 'Pop Explosion', 'Pop concert featuring top artists.', 'StarWave', '2026-06-01', '20:00:00', 4, 'Estadio La Cartuja', 2, 60000, 75.00, 'scheduled', 42000, 'Spotify', 'General', 'view/img/home/events/festi2.jpg', 37.3828000, -5.9731000, 1),
(5, 'Reggaeton Summer Party', 'Reggaeton summer event with big names.', 'FlowMusic', '2026-08-12', '19:00:00', 5, 'BEC Bilbao', 1, 25000, 65.00, 'scheduled', 20000, 'Monster Energy', 'VIP', 'view/img/home/events/concierto2.jpg\r\n', 43.2696000, -2.9450000, 0),
(6, 'Arctic Night Sounds', 'Una noche con los Arctic Monkeys en Madrid.', 'NorthSound Events', '2026-05-13', '20:00:00', 1, 'WiZink Center', 1, 14000, 95.00, 'live', 2000, 'JBL, Estrella Damm', 'VIP', 'view/img/home/events/festi5.jpg', 40.4351000, -3.6613000, 0),
(7, 'Morat Unplugged BCN', 'Concierto acústico de Morat bajo las estrellas.', 'AcousticWave', '2026-06-20', '19:30:00', 2, 'Parc del Fòrum', 2, 10000, 55.00, 'scheduled', 9800, 'Spotify, Voll-Damm', 'General', 'view/img/home/events/festi6.jpg', 41.4036000, 2.2208000, 0),
(8, 'Valencia Indie Fest', 'Festival indie con Arde Bogotá y Natalia Lacunza.', 'IndieValencia', '2026-07-04', '17:00:00', 3, 'Ciudad de las Artes', 3, 20000, 70.00, 'scheduled', 18500, 'Apple Music, Amstel', 'General', 'view/img/home/events/festi7.jpg', 39.4545000, -0.3518000, 8),
(9, 'Sevilla Rock Classics', 'Noches de rock clásico en el estadio.', 'RockSur', '2026-03-01', '21:00:00', 4, 'Estadio La Cartuja', 2, 50000, 80.00, 'finished', 0, 'Mahou, Marshall', 'VIP', 'view/img/home/events/outdoor1.jpg', 37.3828000, -5.9731000, 6),
(10, 'Bilbao Club Session', 'Noche electrónica con Marshmello.', 'BECNight', '2026-04-25', '23:00:00', 5, 'Sala Azkena', 5, 2000, 40.00, 'cancelled', 0, 'Absolut Vodka', 'General', 'view/img/home/events/club1.jpg', 43.2635000, -2.9350000, 1),
(11, 'Olivia Rodrigo en Madrid', 'Tour europeo de Olivia Rodrigo en teatro.', 'StarWave', '2026-09-10', '20:30:00', 1, 'Teatro Circo Price', 4, 5000, 110.00, 'scheduled', 3200, 'Interscope, H&M', 'VIP', 'view/img/home/events/festi5.jpg', 40.4130000, -3.7026000, 7),
(12, 'Green Sounds Garden', 'Música pop-indie al aire libre en jardín.', 'GreenEvents', '2026-08-01', '18:00:00', 2, 'Jardins de Laribal', 6, 3000, 45.00, 'scheduled', 2800, 'Perrier, Eco-Barcelona', 'General', 'view/img/home/events/festi6.jpg', 41.4174000, 2.1534000, 0),
(13, 'Maneskin Valencia', 'El furor del rock italiano llega a Valencia.', 'RockVLC', '2026-10-05', '21:00:00', 3, 'Pabellón Fuente de San Luis', 1, 12000, 85.00, 'sold out', 0, 'Red Bull, Gibson', 'VIP', 'view/img/home/events/festi7.jpg', 39.4890000, -0.3590000, 0),
(14, 'Sevilla Electronic Club', 'Techno y electrónica en sala exclusiva.', 'DarkRoom Events', '2026-11-22', '22:00:00', 4, 'Sala Custom', 5, 1500, 35.00, 'scheduled', 1200, 'Pioneer DJ, Jägermeister', 'General', 'view/img/home/events/outdoor1.jpg', 37.3801000, -5.9958000, 0),
(15, 'Natalia Lacunza Acústico', 'Concierto íntimo y acústico en Bilbao.', 'AcousticNorth', '2026-07-18', '20:00:00', 5, 'Kafe Antzokia', 1, 800, 30.00, 'scheduled', 700, 'Spotify, Sagardoa', 'General', 'view/img/home/events/club1.jpg', 43.2620000, -2.9245000, 1),
(16, 'Mad Rock Open Air', 'Macroconcierto de rock al aire libre en Madrid.', 'OpenAirMadrid', '2026-05-13', '17:00:00', 1, 'Estadio Metropolitano', 2, 65000, 90.00, 'live', 10000, 'Heineken, JBL', 'General', 'view/img/home/events/festi5.jpg', 40.4363000, -3.5993000, 0),
(17, 'Sónar Pop Edition', 'Festival pop con Olivia Rodrigo y Morat.', 'Sónar Org', '2026-06-13', '16:00:00', 2, 'Fira Gran Via', 3, 35000, 120.00, 'scheduled', 30000, 'Seat, Red Bull', 'VIP', 'view/img/home/events/festi6.jpg', 41.3559000, 2.1277000, 0),
(18, 'Jardín Acústico VLC', 'Tarde de música acústica en jardín valenciano.', 'GreenVLC', '2026-04-03', '18:30:00', 3, 'Jardí Botànic de Valencia', 6, 1500, 25.00, 'finished', 0, 'Voll-Damm, Natura', 'General', 'view/img/home/events/outdoor1.jpg', 39.4729000, -0.3811000, 2),
(19, 'Arde Bogotá en Teatro', 'El indie de Arde Bogotá en un teatro único.', 'SurSound', '2026-12-01', '21:00:00', 4, 'Teatro de la Maestranza', 4, 1800, 65.00, 'scheduled', 1600, 'Banco Santander, Spotify', 'VIP', 'view/img/home/events/club1.jpg', 37.3832000, -5.9954000, 0),
(20, 'BBK Electronic Arena', 'Arena electrónica de verano en Bilbao.', 'BBKLive', '2026-08-20', '20:00:00', 5, 'Kobetamendi', 3, 40000, 75.00, 'scheduled', 38000, 'Monster Energy, Pioneer DJ', 'General', 'view/img/home/events/festi5.jpg', 43.2780000, -2.9410000, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `types`
--

DROP TABLE IF EXISTS `types`;
CREATE TABLE IF NOT EXISTS `types` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `name_type` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `types`
--

INSERT INTO `types` (`id_type`, `name_type`, `img_type`) VALUES
(1, 'indoor', 'view/img/home/type/indoor.jpg'),
(2, 'outdoor', 'view/img/home/type/outdoor.jpg'),
(3, 'festival_area', 'view/img/home/type/festiv.jpg'),
(4, 'theatre', 'view/img/home/type/theatre.jpg'),
(5, 'club', 'view/img/home/type/club.jpg'),
(6, 'garden_space', 'view/img/home/type/garden.jpg');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `event_artists`
--
ALTER TABLE `event_artists`
  ADD CONSTRAINT `fk_ea_art` FOREIGN KEY (`id_art`) REFERENCES `artists` (`id_art`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ea_event` FOREIGN KEY (`id_terra`) REFERENCES `terra_events` (`id_terra`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_categories`
--
ALTER TABLE `event_categories`
  ADD CONSTRAINT `fk_ec_cat` FOREIGN KEY (`id_cat`) REFERENCES `categories` (`id_cat`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ec_event` FOREIGN KEY (`id_terra`) REFERENCES `terra_events` (`id_terra`) ON DELETE CASCADE;

--
-- Filtros para la tabla `terra_events`
--
ALTER TABLE `terra_events`
  ADD CONSTRAINT `fk_event_city` FOREIGN KEY (`id_city`) REFERENCES `cities` (`id_city`),
  ADD CONSTRAINT `fk_event_type` FOREIGN KEY (`id_type`) REFERENCES `types` (`id_type`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
