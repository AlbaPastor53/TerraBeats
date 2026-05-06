<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "model/connect.php");

class DAO_search {
 
    // Todas las ciudades para el select
    function search_city() {
        $sql = "SELECT id_city, name_city FROM cities ORDER BY name_city";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }
 
    // Todas las categorías (sin filtro de ciudad)
    function search_category_null() {
        $sql = "SELECT DISTINCT c.id_cat, c.name_cat, c.img_cat
                   FROM categories c
                   INNER JOIN event_categories ec ON ec.id_cat = c.id_cat
                   ORDER BY c.name_cat ASC";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }
 
    // Categorías disponibles para la ciudad seleccionada
    function search_category($id_city) {
        $sql = "SELECT DISTINCT c.id_cat, c.name_cat
                FROM categories c
                INNER JOIN event_categories ec ON ec.id_cat  = c.id_cat
                INNER JOIN terra_events     te ON te.id_terra = ec.id_terra
                WHERE te.id_city = :id_city
                ORDER BY c.name_cat";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([':id_city' => $id_city]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }

     function select_only_city($complete, $id_city) {
        $sql = "SELECT DISTINCT a.id_art, a.name_art
                FROM artists a
                INNER JOIN event_artists ea ON ea.id_art   = a.id_art
                INNER JOIN terra_events  te ON te.id_terra = ea.id_terra
                WHERE te.id_city   = :id_city
                AND   a.name_art LIKE :complete
                ORDER BY a.name_art";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':id_city'  => $id_city,
            ':complete' => $complete . '%'
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }

    function select_only_category($id_category, $complete) {
        $sql = "SELECT DISTINCT a.id_art, a.name_art
                FROM artists a
                INNER JOIN event_artists    ea ON ea.id_art   = a.id_art
                INNER JOIN terra_events     te ON te.id_terra = ea.id_terra
                INNER JOIN event_categories ec ON ec.id_terra = te.id_terra
                WHERE ec.id_cat    = :id_category
                AND   a.name_art LIKE :complete
                ORDER BY a.name_art";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':id_category' => $id_category,
            ':complete'    => $complete . '%'
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }

    function select_city_category($complete, $id_city, $id_category) {
        $sql = "SELECT DISTINCT a.id_art, a.name_art
                FROM artists a
                INNER JOIN event_artists    ea ON ea.id_art   = a.id_art
                INNER JOIN terra_events     te ON te.id_terra = ea.id_terra
                INNER JOIN event_categories ec ON ec.id_terra = te.id_terra
                WHERE te.id_city   = :id_city
                AND   ec.id_cat    = :id_category
                AND   a.name_art LIKE :complete
                ORDER BY a.name_art";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':id_city'     => $id_city,
            ':id_category' => $id_category,
            ':complete'    => $complete . '%'
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }
 
    // Autocomplete: sin filtros, busca artistas por nombre
    function select_artist($complete) {
        $sql = "SELECT id_art, name_art
                FROM artists
                WHERE name_art LIKE :complete
                ORDER BY name_art";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([':complete' => $complete . '%']);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }
}