<?php
// $data = 'hola crtl shop';
// die('<script>console.log('.json_encode( $data ) .');</script>');

$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "/module/shop/model/DAO_shop.php");

@session_start();
$_SESSION['tiempo'] = time();

switch ($_GET['op']) {
    case 'view':
        // $data = 'hola crtl shop view';
        // die('<script>console.log('.json_encode( $data ) .');</script>');
       
        include('module/shop/view/shop.html');
        break;

    case 'all_event':
        // echo json_encode("shop jjjjjjjjjjjjjjjj");
        // exit;
        try { 
            $daoshop = new DAOShop();
            $limit  = isset($_POST['limit'])  ? (int)$_POST['limit']  : 4;
            $offset = isset($_POST['offset']) ? (int)$_POST['offset'] : 0;
            $orderby = $_POST['orderby'];
            $Dates_event = $daoshop->select_all_event($limit , $offset , $orderby);
            

        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($Dates_event)) {
            echo json_encode($Dates_event);
        } else {
            echo json_encode("error");
        }
        break;

    case 'details_event':
        $Date_event  = null;
        $Date_images = null;
        try {
            $daoshop = new DAOShop();
            $Date_event = $daoshop->select_one_event($_GET['id']);
            $Date_images = $daoshop->select_imgs_event($_GET['id']);
            // $Date_extras = $daoshop->select_extra_event($_GET['id']);
            echo json_encode([$Date_event, $Date_images]); 
            exit();

        } catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
       
        if (!empty($Date_event)) {
            $rdo = array();
            $rdo[0] = $Date_event;
            $rdo[1] = $Date_images;
            // $rdo[2] = $Date_extras;

            echo json_encode($rdo);
        } else {
            echo json_encode("error");
        }
        break;

    case 'filter':
        $homeQuery = new DAOShop();
        $limit  = isset($_POST['limit'])  ? (int)$_POST['limit']  : 4;
        $offset = isset($_POST['offset']) ? (int)$_POST['offset'] : 0;
        $filter = json_decode($_POST['filter'], true);
        $orderby = isset($_POST['orderby']) ? $_POST['orderby'] : 'id_terra';

        if (!is_array($filter) || empty($filter)) {
            echo json_encode("error");
            exit;
        }
        $selSlide = $homeQuery->filters($filter, $limit, $offset, $orderby); 
        if (!empty($selSlide)) {
            echo json_encode($selSlide);
        } else {
            echo json_encode("error");
        }
        break;
    case 'count':
        $homeQuery = new DAOShop();
        $selSlide = $homeQuery -> select_all_count();
        
        if (!empty($selSlide)) {
            echo json_encode($selSlide);
        }
        else {
            echo "error";
        }
        break;
    case 'count_filters':
        $homeQuery = new DAOShop();
        $filter = json_decode($_POST['filter'], true);
        $selSlide = $homeQuery->filters_count($filter);  // ← método correcto
        if (!empty($selSlide)) {
            echo json_encode($selSlide);
        } else {
            echo "error";
        }
        break;
        

    case 'get_filters':
        $daoshop = new DAOShop();
        $data = $daoshop->select_filters_data();
        echo json_encode($data);
        break;

    case 'count_event_related':
        $daoshop = new DAOShop();

        $city = $_POST['city'];
        $type = $_POST['type'];

        $data = $daoshop->count_more_event_related($city, $type);
        echo json_encode($data);
        break;

    case 'event_related':
        $daoshop = new DAOShop();

        $idEvent = $_POST['idEvent'];
        $city    = $_POST['city'];
        $type    = $_POST['type'];
        $loaded  = $_POST['loaded'];
        $items   = $_POST['items'];
        
        $data = $daoshop->select_event_related($idEvent, $city, $type, $loaded, $items);
        echo json_encode($data);
        break;


}
