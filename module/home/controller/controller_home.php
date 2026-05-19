<?php
// $data = 'hola crtl home';
// die('<script>console.log('.json_encode( $data ) .');</script>');

$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "module/home/model/DAOHome.php");

@session_start();

switch ($_GET['op']) {
    case 'view':
        // $data = 'hola crtl home view';
        // die('<script>console.log('.json_encode( $data ) .');</script>');
        include("module/home/view/home.html");
        break;

    case 'homePageEvent':
        // echo json_encode("homePageEvent");
        // exit();
        try{
            $daohome = new DAOHome();
            $SelectEvent = $daohome->select_all_event();
            // echo json_encode($SelectEvent);
            // exit();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($SelectEvent)){
            echo json_encode($SelectEvent); 
        }
        else{
            echo json_encode("error");
        }
        break;

    case 'homePageCategory':
        // echo json_encode("homePageCategory");
        // exit();
        try{
            $daohome = new DAOHome();
            $SelectCategory = $daohome->select_category();
            // echo json_encode($SelectCategory);
            // exit();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($SelectCategory)){
            echo json_encode($SelectCategory); 
        }
        else{
            echo json_encode("error");
        }
        break;

    case 'homePageArtist':
        // echo json_encode("homePageArtist");
        // exit();
        try{
            $daohome = new DAOHome();
            $SelectArtist = $daohome->select_artist();
            // echo json_encode($SelectArtist);
            // exit();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($SelectArtist)){
            echo json_encode($SelectArtist); 
        }
        else{
            echo json_encode("error");
        }
        break;

    case 'homePageCity':
        // echo json_encode("homePageCity");
        // exit();
        try{
            $daohome = new DAOHome();
            $SelectCity = $daohome->select_city();
            // echo json_encode($SelectArtist);
            // exit();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($SelectCity)){
            echo json_encode($SelectCity); 
        }
        else{
            echo json_encode("error");
        }
        break;

    case 'homePageType':
        // echo json_encode("homePageArtist");
        // exit();
        try{
            $daohome = new DAOHome();
            $SelectType = $daohome->select_type();
            // echo json_encode($SelectType);
            // exit();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($SelectType)){
            echo json_encode($SelectType); 
        }
        else{
            echo json_encode("error");
        }
        break;

    case 'homePageMostVisited':
        // echo json_encode("homePageMostVisited");
        // exit();
        try{
            $daohome = new DAOHome();
            $MostVisited = $daohome->select_most_visited();
        } catch(Exception $e){
            echo json_encode("error");
        }
            
        if(!empty($MostVisited)){
            echo json_encode($MostVisited); 
        }
        else{
            echo json_encode("error");
        }
        break;
   
    default:
        include("view/inc/error404.php");
        break;
}