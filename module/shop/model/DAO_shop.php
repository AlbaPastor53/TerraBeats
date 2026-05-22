<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "/model/connect.php");

class DAOShop{
    
    function select_all_event($limit, $offset, $orderby) {
    
    $sql = "SELECT 
                te.*,
                c.name_city,
                t.name_type 
            FROM terra_events te
            INNER JOIN cities c ON te.id_city = c.id_city
            INNER JOIN types  t ON te.id_type = t.id_type
            ORDER BY $orderby
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

    function filters($filter, $limit, $offset, $orderby){

    $allowed = ['te.id_terra', 'te.price ASC', 'te.price DESC', 'te.event_date ASC', 'te.event_date DESC', 'te.name_event ASC'];
    if (!in_array($orderby, $allowed)) {
        $orderby = 'te.id_terra';
    }
    
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

        $sql .= " ORDER BY $orderby LIMIT :limit OFFSET :offset";

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

   function count_more_event_related($city, $type) {
        $sql = "SELECT COUNT(DISTINCT e.id_terra) - 1 AS n_prod
                FROM terra_events e
                WHERE e.id_city = :city 
                OR e.id_type = :type";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([':city' => $city, ':type' => $type]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows;
    }

    function select_event_related($idEvent, $city, $type, $loaded, $items) {
        $loaded = (int) $loaded;
        $items  = (int) $items;
        $sql = "SELECT e.id_terra, e.name_event, e.description, e.organization,
                    e.event_date, e.event_time, e.location, e.venue_capacity,
                    e.price, e.status, e.tickets_available, e.sponsors,
                    e.ticket_type, e.img, e.lat, e.lng,
                    ci.name_city, t.name_type
                FROM terra_events e
                JOIN cities ci  ON e.id_city = ci.id_city
                JOIN types t    ON e.id_type = t.id_type
                WHERE (e.id_city = :city
                OR e.id_type = :type)
                AND e.id_terra <> :idEvent
                GROUP BY e.id_terra
                LIMIT $loaded, $items";




        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':city'    => $city,
            ':type'    => $type,
            ':idEvent' => $idEvent
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        foreach ($rows as &$row) {
            $img_event = $row['img'] ? [$row['img']] : [];
            $row['imgs_event'] = $img_event;
        }
        return $rows;
    }

    function update_visits_event($id) {
        $sql = "UPDATE terra_events SET visits = visits + 1 WHERE id_terra = :id";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        connect::close($conexion);
}
}
