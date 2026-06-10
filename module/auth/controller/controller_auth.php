<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "module/auth/model/DAO_auth.php");
include($path . "model/middleware_auth.php"); 

@session_start();

switch ($_GET['op']) {
    case 'view':
        // $data = 'hola crtl auth view';
        // die('<script>console.log('.json_encode( $data ) .');</script>');
        include("module/auth/view/auth.html");
        break;
    case 'register':
        ob_clean();
        header('Content-Type: application/json');
        // Comprobar que la email no exista
        try {
            $daoLog = new DAOAuth();
            $check = $daoLog->select_email($_POST['reg_email']);
        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if ($check) {
            $check_mail = false;
        } else {
            $check_mail = true;
        }

        try {
            $daoLog = new DAOAuth();
            $check2 = $daoLog->select_username($_POST['reg_username']);
        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if ($check2) {
            $check_username = false;
        } else {
            $check_username = true;
        }

        // Si no existe el email o el usuario
        if ($check_mail && $check_username) {
            try {
                $daoLog = new DAOAuth();
                $rdo = $daoLog->insert_user($_POST['reg_username'], $_POST['reg_email'], $_POST['reg_password']);
            } catch (Exception $e) {
                echo json_encode("error");
                exit;
            }
            if (!$rdo) {
                echo json_encode("error_user");
                exit;
            } else {
                echo json_encode("ok");
                exit;
            }
        } else {
            if (!$check_mail) {
                echo json_encode("error_email");
            } else {
                echo json_encode("error_username");
            }
            exit;
        }
        break;

    case 'login':
        ob_clean();
        header('Content-Type: application/json');
        try {
            $daoLog = new DAOAuth();
            $rdo = $daoLog->select_user($_POST['login_identity']);

            if ($rdo == "error_user") {
                echo json_encode("error_user");
                exit;
            } else {
                if (password_verify($_POST['login_password'], $rdo['password'])) {
                    $token= create_token($rdo["username"]);
                    $_SESSION['username'] = $rdo['username']; 
                    $_SESSION['tiempo'] = time();
                    echo json_encode($token);
                    exit;
                } else {
                    echo json_encode("error_passwd");
                    exit;
                }
            }
        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }
        break;

    case 'logout':
        unset($_SESSION['username']);
        unset($_SESSION['tiempo']);
        session_destroy();

        echo json_encode("Done");
        break;

    case 'data_user':
        ob_clean();
        header('Content-Type: application/json');
        $json = decode_token($_POST['token']);
        $daoLog = new DAOAuth();
        $rdo = $daoLog->select_data_user($json['username']);
        echo json_encode($rdo);
        exit;
        break;

     case 'controluser':
        $token_dec = decode_token($_POST['token']);

        if ($token_dec['exp'] < time()) {
            echo json_encode("Wrong_User");
            exit();
        }

       if (isset($_SESSION['username']) && ($_SESSION['username']) == $token_dec['username']) {
            echo json_encode("Correct_User");
            exit();
        } else {
            echo json_encode("Wrong_User");
            exit();
        }
        break;
    
    case 'actividad':
        if (!isset($_SESSION["tiempo"])) {
            echo json_encode("inactivo");
            exit();
        } else {
            if ((time() - $_SESSION["tiempo"]) >= 1800) { //1800s=30min
                echo json_encode("inactivo");
                exit();
            } else {
                echo json_encode("activo");
                exit();
            }
        }
        break;

    case 'controluser':
        $token_dec = decode_token($_POST['token']);

        if ($token_dec['exp'] < time()) {
            echo json_encode("Wrong_User");
            exit();
        }

        if (isset($_SESSION['username']) && ($_SESSION['username']) == $token_dec['username']) {
            echo json_encode("Correct_User");
            exit();
        } else {
            echo json_encode("Wrong_User");
            exit();
        }
        break;

    case 'refresh_token':
        $old_token = decode_token($_POST['token']);
        $new_token = create_token($old_token['username']);
        echo json_encode($new_token);
        break;

    case 'refresh_token':
        $old_token = decode_token($_POST['token']);
        $new_token = create_token($old_token['username']);
        echo json_encode($new_token);
        break;

    case 'refresh_cookie':
        session_regenerate_id();
            echo json_encode("Done");
            exit;
        break;
    case 'profile':
        include("module/profile/view/profile.html");
        break;
            
}
 