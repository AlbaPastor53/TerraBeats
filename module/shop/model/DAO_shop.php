<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "/model/connect.php");

class DAOShop{
    
function select_all_event($limit, $offset) {
    $sql = "SELECT 
                te.*,
                c.name_city ,
                t.name_type 
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types  t ON te.id_type = t.id_type
            ORDER BY te.event_date ASC
            LIMIT :limit OFFSET :offset";

    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();                           
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);  
    connect::close($conexion);

    return $rows;
}

function select_all_count() {
    $sql = "SELECT COUNT(DISTINCT te.id_terra) as num_events
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types  t ON te.id_type = t.id_type";

    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $stmt->execute();                           
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);  
    connect::close($conexion);

    return $rows;
}

function select_one_event($id) {
    $sql = "SELECT 
                te.*,
                c.name_city,
                t.name_type
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types  t ON te.id_type = t.id_type
            WHERE te.id_terra = :id";           
    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT); 
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);      
    connect::close($conexion);

    return $res;
}

function select_imgs_event($id) {
        $sql = "SELECT i.ruta AS img
                FROM images i
                JOIN event_images ei ON i.id_img = ei.id_img
                WHERE ei.id_terra = :id";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);

        return $res;
}

function filters($filter, $limit, $offset){

    $sql = "SELECT te.*, c.name_city , t.name_type
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types t ON te.id_type = t.id_type
            ";

    $conditions = [];
    $params = [];

    foreach ($filter as $f) {
        $col = $f[0]; // name_art, name_cat, name_city, name_type
        $val = $f[1];

        switch ($col) {
            case 'name_art':
                $conditions[] = "te.id_terra IN (
                    SELECT ea.id_terra FROM event_artists ea
                    INNER JOIN artists a ON ea.id_art = a.id_art
                    WHERE a.name_art = :name_art)";
                $params[':name_art'] = $val;
                break;
            case 'name_cat':
                $conditions[] = "te.id_terra IN (
                    SELECT ec.id_terra FROM event_categories ec
                    INNER JOIN categories ca ON ec.id_cat = ca.id_cat
                    WHERE ca.name_cat = :name_cat)";
                $params[':name_cat'] = $val;
                break;
            case 'name_city':
                $conditions[] = "c.name_city = :name_city";
                $params[':name_city'] = $val;
                break;
            case 'name_type':
                $conditions[] = "t.name_type = :name_type";
                $params[':name_type'] = $val;
                break;
            case 'price_min':
                $conditions[] = "te.price >= :price_min";
                $params[':price_min'] = (float)$val;
                break;
            case 'price_max':
                $conditions[] = "te.price <= :price_max";
                $params[':price_max'] = (float)$val;
                break;
        }
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " LIMIT :limit OFFSET :offset";

    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $params[':limit']  = $limit;
    $params[':offset'] = $offset;
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    connect::close($conexion);
    return $rows;

}   

function filters_count($filter){

    $sql = "SELECT COUNT(DISTINCT te.id_terra) as num_filters
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types t ON te.id_type = t.id_type";

    $conditions = [];
    $params = [];

    foreach ($filter as $f) {
        $col = $f[0];
        $val = $f[1];

        switch ($col) {
            case 'name_art':
                $conditions[] = "te.id_terra IN (
                    SELECT ea.id_terra FROM event_artists ea
                    INNER JOIN artists a ON ea.id_art = a.id_art
                    WHERE a.name_art = :name_art)";
                $params[':name_art'] = $val;
                break;
            case 'name_cat':
                $conditions[] = "te.id_terra IN (
                    SELECT ec.id_terra FROM event_categories ec
                    INNER JOIN categories ca ON ec.id_cat = ca.id_cat
                    WHERE ca.name_cat = :name_cat)";
                $params[':name_cat'] = $val;
                break;
            case 'name_city':
                $conditions[] = "c.name_city = :name_city";
                $params[':name_city'] = $val;
                break;
            case 'name_type':
                $conditions[] = "t.name_type = :name_type";
                $params[':name_type'] = $val;
                break;
            case 'price_min':
                $conditions[] = "te.price >= :price_min";
                $params[':price_min'] = (float)$val;
                break;
            case 'price_max':
                $conditions[] = "te.price <= :price_max";
                $params[':price_max'] = (float)$val;
                break;
        }
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $conexion = connect::con();
    $stmt = $conexion->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    connect::close($conexion);
    return $rows;

} 

function select_filters_data() {
    $conexion = connect::con();

    $artists    = $conexion->query("SELECT id_art, name_art FROM artists")->fetchAll(PDO::FETCH_ASSOC);
    $types      = $conexion->query("SELECT id_type, name_type FROM types")->fetchAll(PDO::FETCH_ASSOC);
    $cities     = $conexion->query("SELECT id_city, name_city FROM cities")->fetchAll(PDO::FETCH_ASSOC);
    $categories = $conexion->query("SELECT id_cat, name_cat FROM categories")->fetchAll(PDO::FETCH_ASSOC);

    connect::close($conexion);

    return [
        'artists'    => $artists,
        'types'      => $types,
        'cities'     => $cities,
        'categories' => $categories
    ];
}
}
