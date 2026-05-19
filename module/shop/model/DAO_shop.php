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
        $cat_conditions = [];
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
                    $i = count($cat_conditions);
                    $key = ':name_cat_' . $i;
                    $cat_conditions[] = "te.id_terra IN (
                        SELECT ec.id_terra FROM event_categories ec
                        INNER JOIN categories ca ON ec.id_cat = ca.id_cat
                        WHERE ca.name_cat = $key)";
                    $params[$key] = $val;
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

        if (!empty($cat_conditions)) {
            $conditions[] = '(' . implode(' OR ', $cat_conditions) . ')';
        }

        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " LIMIT :limit OFFSET :offset";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);

        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);  // ← entero
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);  // ← entero

        $stmt->execute();
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

    function select_events_related($art, $loaded, $items) {
        $sql = "SELECT 
                te.*,
                c.name_city,
                t.name_type,
                GROUP_CONCAT(a2.name_art SEPARATOR ', ') AS count_artists
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types t ON te.id_type = t.id_type
            INNER JOIN event_artists ea ON te.id_terra = ea.id_terra
            INNER JOIN artists a ON ea.id_art = a.id_art
            LEFT JOIN event_artists ea2 ON te.id_terra = ea2.id_terra
            LEFT JOIN artists a2 ON ea2.id_art = a2.id_art
            WHERE a.name_art = '$art'
            GROUP BY te.id_terra
            LIMIT $loaded, $items";

             $conexion = connect::con();
            $stmt = $conexion->prepare($sql);
            $stmt->bindValue(':art', $art);
            $stmt->bindValue(':loaded', (int)$loaded, PDO::PARAM_INT);
            $stmt->bindValue(':items',  (int)$items,  PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            connect::close($conexion);
        return $rows;
        
    }

    function count_more_events_related($more_art) {
         $sql = "SELECT COUNT(DISTINCT te.id_terra) as num_events
                FROM terra_events te
                INNER JOIN event_artists ea ON te.id_terra = ea.id_terra
                INNER JOIN artists a ON ea.id_art = a.id_art
                WHERE a.name_art = '$more_art'";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();                           
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        connect::close($conexion);

        return $rows;
    }

    function update_visits_event($id) {
        $sql = "UPDATE terra_events SET visists = visists + 1 WHERE id_terra = :id";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        connect::close($conexion);
}
}
