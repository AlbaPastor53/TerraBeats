<?php
// $data = 'hola crtl shop';
// die('<script>console.log('.json_encode( $data ) .');</script>');

$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "/module/shop/model/DAO_shop.php");

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
            $Dates_event = $daoshop->select_all_event($limit , $offset);
         
        } catch (Exception $e) {
            echo json_encode("error");
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
            echo json_encode([$Date_event, $Date_images]); // ← esto faltaba
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

        if (!is_array($filter) || empty($filter)) {
            echo json_encode("error");
            exit;
        }
        $selSlide = $homeQuery->filters($filter, $limit, $offset); // ← usa $filter, no $_POST['filter']
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
}
