<?php
$path = $_SERVER['DOCUMENT_ROOT'] . '/CRUD/terrabeats_MVC/';
include($path . "module/profile/model/DAOProfile.php");
include($path . "model/middleware_auth.php"); 

@session_start();

$_SESSION['tiempo'] = time();

switch ($_GET['op']) {
    case 'view':
        // $data = 'hola crtl profile view';
        // die('<script>console.log('.json_encode( $data ) .');</script>');
        include("module/profile/view/profile.html");
        break;
    case 'get_user_data':
        ob_clean();
        header('Content-Type: application/json');
        try {
            // Decodificamos el token que viene por POST al igual que haces en 'controluser' o 'data_user'
            $token_dec = decode_token($_POST['token']);
            
            if (!$token_dec || !isset($token_dec['username'])) {
                echo json_encode("error_token");
                exit;
            }

            $daoProfile = new DAOProfile();
            $rdo = $daoProfile->select_data_user($token_dec['username']);

            if ($rdo == "error_user") {
                echo json_encode("error_user");
                exit;
            } else {
                // Quitamos datos sensibles por seguridad antes de retornar
                unset($rdo['password']);
                echo json_encode($rdo);
                exit;
            }
        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }
        break;

    case 'update_account':
        ob_clean();
        header('Content-Type: application/json');

        try {
            // 1. Validar Token JWT
            $token_dec = decode_token($_POST['token']);
            if (!$token_dec || !isset($token_dec['username'])) {
                echo json_encode("error_token");
                exit;
            }

            $daoProfile = new DAOProfile();
            
            // 2. Traer los datos actuales reales de la BD para comparar
            $current_db_user = $daoProfile->select_data_user($token_dec['username']);
            if ($current_db_user == "error_user") {
                echo json_encode("error_user");
                exit;
            }

            // 1. Capturamos lo que viene del formulario
            $input_username = isset($_POST['username']) ? trim($_POST['username']) : '';
            $input_password = isset($_POST['password']) ? trim($_POST['password']) : '';

           $db_username = $current_db_user['username'];
            $id_user = $current_db_user['id_user'];

            // 2. Determinamos qué quiere cambiar el usuario realmente
            $cambia_username = ($input_username !== $db_username && !empty($input_username));
            // Si el campo password NO está vacío, significa que el usuario ha escrito una nueva contraseña
            $cambia_password = (!empty($input_password)); 

            // 3. Ejecutamos la acción correspondiente en la Base de Datos
            if ($cambia_username && $cambia_password) {
                // Escenario: Cambia Usuario Y Contraseña a la vez
                if (strlen($input_username) < 5) { echo json_encode("error_username_corto"); exit; }
                if (strlen($input_password) < 8) { echo json_encode("error_password_corta"); exit; }
                
                $hashed_password = password_hash($input_password, PASSWORD_ARGON2ID);
                $rdo = $daoProfile->update_user_full($id_user, $input_username, $hashed_password);
                
            } else if ($cambia_username) {
                // Escenario A: Cambia SOLO el nombre de usuario
                if (strlen($input_username) < 5) { echo json_encode("error_username_corto"); exit; }
                $rdo = $daoProfile->update_username_only($id_user, $input_username);
                
            } else if ($cambia_password) {
                // Escenario B: Cambia SOLO la contraseña
                if (strlen($input_password) < 8) { echo json_encode("error_password_corta"); exit; }
                
                $hashed_password = password_hash($input_password, PASSWORD_ARGON2ID);
                $rdo = $daoProfile->update_password_only($id_user, $hashed_password);
                
            } else {
                // No ha escrito nada nuevo en ningún campo
                echo json_encode("no_changes");
                exit;
            }

            // 4. Enviar respuesta final al JS
            if ($rdo) {
                echo json_encode("success");
            } else {
                echo json_encode("error_update");
            }
            exit;

        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }
        break;

    
}